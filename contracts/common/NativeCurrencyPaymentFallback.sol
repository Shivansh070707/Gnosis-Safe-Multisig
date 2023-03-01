// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.19;

/**
 * @title EtherPaymentFallback - A contract that has a fallback to accept native currency payments.
 * @author Richard Meissner - @rmeissner
 */
contract NativeCurrencyPaymentFallback {
    event SafeReceived(address indexed sender, uint256 value);

    /**
     * @notice Receive function accepts native currency transactions.
     * @dev Emits an event with sender and received value.
     */
    receive() external payable {
        emit SafeReceived(msg.sender, msg.value);
    }
}
