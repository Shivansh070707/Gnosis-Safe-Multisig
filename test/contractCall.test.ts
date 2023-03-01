import { expect } from 'chai';
import { ethers } from 'hardhat';
import { executeContractCallWithSigners } from '../scripts/execution';
import { calculateProxyAddress } from '../scripts/proxies';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Safe, SafeProxyFactory } from '../typechain-types';
import { Wallet } from 'ethers';
import { SafeProxy } from '../typechain-types/proxies/SafeProxy.sol';

describe('Contract Call Tests', function () {
  let user1: SignerWithAddress | Wallet,
    user2: SignerWithAddress | Wallet,
    user3: SignerWithAddress | Wallet,
    user4: SignerWithAddress | Wallet;
  let proxy_address: string;
  let safe: Safe;
  before(async () => {
    [user1, user2, user3, user4] = await ethers.getSigners();
  });
  it('will deploy safe wallet ', async () => {
    //deploying singleton
    const SafeContract = await ethers.getContractFactory('Safe');
    const singleton: Safe = await SafeContract.deploy();
    await singleton.deployed();

    //deploying factory
    const Factory = await ethers.getContractFactory('SafeProxyFactory');
    const factory: SafeProxyFactory = await Factory.deploy();
    await factory.deployed();

    //creating proxy with factory contract
    let saltNonce = 12;
    const Proxy = await factory.createProxyWithNonce(
      singleton.address,
      '0x58',
      saltNonce
    );
    let proxy = await Proxy.wait();

    let proxy_Address = await calculateProxyAddress(
      factory,
      singleton.address,
      '0x58',
      saltNonce
    );

    proxy_address = proxy.events[0].args.proxy;
    expect(proxy_Address).to.equal(proxy_address);
  });
  it('will setup gnosis safe proxy', async () => {
    let zero = ethers.constants.AddressZero;
    safe = await ethers.getContractAt('Safe', proxy_address);
    await safe.setup(
      [user1.address, user2.address, user3.address],
      3,
      zero,
      '0x',
      zero,
      zero,
      0,
      zero
    );
    expect(await safe.getThreshold()).to.equal(3);
    expect(await safe.isOwner(user2.address)).to.equal(true);
  });
  it('will add a new owner', async () => {
    await user1.sendTransaction({
      to: safe.address,
      value: ethers.utils.parseEther('1'),
    });
    await executeContractCallWithSigners(
      safe,
      safe,
      'addOwnerWithThreshold',
      [user4.address, 4],
      [user1 as Wallet, user2 as Wallet, user3 as Wallet]
    );
    expect(await safe.getThreshold()).to.equal(4);
    expect(await safe.isOwner(user4.address)).to.equal(true);
  });
  it('will remove owner', async () => {
    await executeContractCallWithSigners(
      safe,
      safe,
      'removeOwner',
      ['0x0000000000000000000000000000000000000001', user4.address, 3],
      [user1 as Wallet, user2 as Wallet, user3 as Wallet, user4 as Wallet]
    );
    expect(await safe.getThreshold()).to.equal(3);
    expect(await safe.isOwner(user4.address)).to.equal(false);
  });
  it('will send tokens', async () => {
    const Token = await ethers.getContractFactory('Token');
    const token = await Token.deploy(safe.address);
    await token.deployed();
    await expect(
      executeContractCallWithSigners(
        safe,
        token,
        'transfer',
        [user4.address, ethers.utils.parseEther('1')],
        [user1 as Wallet, user2 as Wallet, user3 as Wallet]
      )
    ).to.changeTokenBalances(
      token,
      [safe.address, user4.address],
      [ethers.utils.parseEther('-1'), ethers.utils.parseEther('1')]
    );
  });
});
