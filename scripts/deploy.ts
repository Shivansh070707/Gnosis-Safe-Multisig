import { ethers } from 'hardhat';
import { Safe, SafeProxyFactory } from '../typechain-types/';
import { storeContract } from './storeContract';

export async function main() {
  //deploying safe
  const Safe = await ethers.getContractFactory('Safe');
  const singleton: Safe = await Safe.deploy();
  await singleton.deployed();
  const singleton_address = singleton.address;
  await storeContract(
    singleton.address,
    JSON.parse(String(singleton.interface.format('json'))),
    'singleton'
  );
  console.log(`singleton deployed to ${singleton.address}`);

  //deploying factory
  const Factory = await ethers.getContractFactory('SafeProxyFactory');
  const factory: SafeProxyFactory = await Factory.deploy();
  await factory.deployed();
  console.log(`factory deployed to ${factory.address}`);
  await storeContract(
    factory.address,
    JSON.parse(String(factory.interface.format('json'))),
    'safeFactory'
  );

  const saltNonce = 7;
  const proxy = await factory.createProxyWithNonce(
    singleton.address,
    '0x58',
    saltNonce
  );
  let proxy1 = await proxy.wait();

  let proxy_address: string = proxy1.events[0].args.proxy;
  console.log('proxy address', proxy_address);
  let zero = ethers.constants.AddressZero;
  let safe = Safe.attach(proxy_address);
  await storeContract(
    safe.address,
    JSON.parse(String(safe.interface.format('json'))),
    'safeProxy'
  );
  await safe.setup(
    [
      '0x784aD26F3dff4B164979F36724d8E0297dc2581e',
      '0xb824465A26846eF8f7E6Ce3a2AEEc2F359690218',
      '0xdC890633615E20966E32908b5082A5Db710C10de',
    ],
    1,
    zero,
    '0x',
    zero,
    zero,
    0,
    zero
  );

  return { factory, safe, singleton_address, proxy_address };
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
