// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title WhisperVault - Encrypted Message Storage
/// @author WhisperLink Team
/// @notice A secure on-chain encrypted messaging vault
/// @dev Messages are AES-encrypted client-side before storage
contract WhisperVault is SepoliaConfig {
    /// @notice Message structure
    struct Message {
        address sender;
        bytes encryptedContent;  // AES-encrypted message content
        uint256 timestamp;
        bool isResponse;
    }

    /// @notice Mapping from user address to their messages
    mapping(address => Message[]) private _userMessages;

    /// @notice Event emitted when a new message is stored
    event MessageStored(address indexed user, uint256 indexed messageIndex, uint256 timestamp, bool isResponse);
    
    /// @notice Event emitted when messages are cleared
    event MessagesCleared(address indexed user);

    /// @notice Returns the message count for a specific user
    /// @param user The user address
    /// @return The number of messages stored for the user
    function getMessageCount(address user) external view returns (uint256) {
        return _userMessages[user].length;
    }

    /// @notice Returns message metadata (non-encrypted parts)
    /// @param user The user address
    /// @param index The message index
    /// @return sender The message sender
    /// @return timestamp The message timestamp
    /// @return isResponse Whether this is an auto-response
    function getMessageMetadata(
        address user,
        uint256 index
    ) external view returns (address sender, uint256 timestamp, bool isResponse) {
        require(index < _userMessages[user].length, "Message index out of bounds");
        Message storage msg_ = _userMessages[user][index];
        return (msg_.sender, msg_.timestamp, msg_.isResponse);
    }

    /// @notice Returns the encrypted content of a message
    /// @param user The user address
    /// @param index The message index
    /// @return The encrypted message bytes
    function getEncryptedContent(address user, uint256 index) external view returns (bytes memory) {
        require(index < _userMessages[user].length, "Message index out of bounds");
        return _userMessages[user][index].encryptedContent;
    }

    /// @notice Returns a full message
    /// @param user The user address
    /// @param index The message index
    /// @return sender The message sender
    /// @return encryptedContent The encrypted message content
    /// @return timestamp The message timestamp
    /// @return isResponse Whether this is an auto-response
    function getMessage(
        address user,
        uint256 index
    ) external view returns (
        address sender,
        bytes memory encryptedContent,
        uint256 timestamp,
        bool isResponse
    ) {
        require(index < _userMessages[user].length, "Message index out of bounds");
        Message storage msg_ = _userMessages[user][index];
        return (msg_.sender, msg_.encryptedContent, msg_.timestamp, msg_.isResponse);
    }

    /// @notice Store a new encrypted message
    /// @param encryptedContent The AES-encrypted message content
    function storeMessage(bytes calldata encryptedContent) external {
        require(encryptedContent.length > 0, "Empty message");
        require(encryptedContent.length <= 10000, "Message too large");

        _userMessages[msg.sender].push(
            Message({
                sender: msg.sender,
                encryptedContent: encryptedContent,
                timestamp: block.timestamp,
                isResponse: false
            })
        );

        emit MessageStored(msg.sender, _userMessages[msg.sender].length - 1, block.timestamp, false);
    }

    /// @notice Store an auto-response (system reply)
    /// @param encryptedContent The AES-encrypted response content
    function storeResponse(bytes calldata encryptedContent) external {
        require(encryptedContent.length > 0, "Empty message");
        require(encryptedContent.length <= 10000, "Message too large");

        _userMessages[msg.sender].push(
            Message({
                sender: address(this),
                encryptedContent: encryptedContent,
                timestamp: block.timestamp,
                isResponse: true
            })
        );

        emit MessageStored(msg.sender, _userMessages[msg.sender].length - 1, block.timestamp, true);
    }

    /// @notice Clear all messages for the caller
    function clearMessages() external {
        delete _userMessages[msg.sender];
        emit MessagesCleared(msg.sender);
    }
    
    /// @notice Get all messages for a user (batch read)
    /// @param user The user address
    /// @return An array of all messages
    function getAllMessages(address user) external view returns (Message[] memory) {
        return _userMessages[user];
    }
}
