// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.19;
import "./SafeProxy.sol";

interface IProxyCreationCallback {
    function proxyCreated(
        SafeProxy proxy,
        address _singleton,
        bytes calldata initializer,
        uint256 saltNonce
    ) external;
}
