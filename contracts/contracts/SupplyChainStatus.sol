// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SupplyChainStatus
 * @dev Contract for tracking supply chain status updates
 * Extends BatchTracking with status management
 */
contract SupplyChainStatus {
    
    // Status enum matching the app's status flow
    enum Status {
        Created,
        Harvested,
        Processing,
        QualityCheck,
        Packaged,
        InTransit,
        InDistribution,
        Delivered,
        Completed,
        Cancelled
    }
    
    struct StatusUpdate {
        string batchId;
        Status status;
        string location;
        string notes;
        address updatedBy;
        uint256 timestamp;
    }
    
    // Batch ID to current status
    mapping(string => Status) public batchStatuses;
    
    // Batch ID to status history
    mapping(string => StatusUpdate[]) public statusHistory;
    
    // Events
    event StatusUpdated(
        string indexed batchId,
        Status indexed newStatus,
        string location,
        address indexed updatedBy,
        uint256 timestamp
    );
    
    /**
     * @dev Update batch status
     */
    function updateStatus(
        string memory _batchId,
        Status _status,
        string memory _location,
        string memory _notes
    ) external {
        batchStatuses[_batchId] = _status;
        
        statusHistory[_batchId].push(StatusUpdate({
            batchId: _batchId,
            status: _status,
            location: _location,
            notes: _notes,
            updatedBy: msg.sender,
            timestamp: block.timestamp
        }));
        
        emit StatusUpdated(_batchId, _status, _location, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get current status of a batch
     */
    function getCurrentStatus(string memory _batchId) external view returns (Status) {
        return batchStatuses[_batchId];
    }
    
    /**
     * @dev Get status history length
     */
    function getStatusHistoryLength(string memory _batchId) external view returns (uint256) {
        return statusHistory[_batchId].length;
    }
    
    /**
     * @dev Get status update at index
     */
    function getStatusUpdateAt(string memory _batchId, uint256 _index) external view returns (
        Status status,
        string memory location,
        string memory notes,
        address updatedBy,
        uint256 timestamp
    ) {
        require(_index < statusHistory[_batchId].length, "Index out of bounds");
        StatusUpdate storage update = statusHistory[_batchId][_index];
        
        return (
            update.status,
            update.location,
            update.notes,
            update.updatedBy,
            update.timestamp
        );
    }
    
    /**
     * @dev Calculate progress percentage (0-100)
     */
    function calculateProgress(string memory _batchId) external view returns (uint256) {
        Status status = batchStatuses[_batchId];
        
        // Map status to progress percentage
        if (status == Status.Cancelled) return 0;
        
        // Each status represents roughly 11% progress
        return (uint256(status) + 1) * 100 / 9;
    }
    
    /**
     * @dev Get status name as string
     */
    function getStatusName(Status _status) external pure returns (string memory) {
        if (_status == Status.Created) return "Created";
        if (_status == Status.Harvested) return "Harvested";
        if (_status == Status.Processing) return "Processing";
        if (_status == Status.QualityCheck) return "Quality Check";
        if (_status == Status.Packaged) return "Packaged";
        if (_status == Status.InTransit) return "In Transit";
        if (_status == Status.InDistribution) return "In Distribution";
        if (_status == Status.Delivered) return "Delivered";
        if (_status == Status.Completed) return "Completed";
        return "Cancelled";
    }
}
