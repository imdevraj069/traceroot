// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BatchTracking
 * @dev Supply chain tracking contract for TraceRoot
 * Tracks batches of products from farm to consumer with NFC verification
 */
contract BatchTracking {
    
    // ============== Structs ==============
    
    struct Batch {
        string batchId;
        string productName;
        string variety;
        uint256 quantity;
        string unit;
        string location;
        uint256 harvestDate;
        uint256 expiryDate;
        string nfcTagId;
        address creator;
        uint256 timestamp;
        bool exists;
    }
    
    struct QualityMetric {
        string metricId;
        string batchId;
        string metricType;
        string value;
        string unit;
        uint256 timestamp;
        address inspector;
        bool exists;
    }
    
    struct NFCAuthentication {
        string authId;
        string batchId;
        string nfcTagId;
        uint256 timestamp;
        string location;
        bool isValid;
    }
    
    // ============== State Variables ==============
    
    mapping(string => Batch) public batches;
    mapping(string => QualityMetric) public qualityMetrics;
    mapping(string => NFCAuthentication) public nfcAuthentications;
    
    // Arrays for iteration
    string[] public batchIds;
    string[] public qualityMetricIds;
    string[] public authenticationIds;
    
    // Batch to quality metrics mapping
    mapping(string => string[]) public batchQualityMetrics;
    
    // Batch to authentication mapping
    mapping(string => string[]) public batchAuthentications;
    
    // NFC tag authentication count
    mapping(string => uint256) public nfcAuthenticationCount;
    
    // ============== Events ==============
    
    event BatchCreated(
        string indexed batchId,
        string productName,
        address indexed creator,
        uint256 timestamp
    );
    
    event QualityMetricAdded(
        string indexed metricId,
        string indexed batchId,
        string metricType,
        address indexed inspector
    );
    
    event NFCAuthenticated(
        string indexed authId,
        string indexed batchId,
        string nfcTagId,
        bool isValid,
        uint256 timestamp
    );
    
    event BatchStatusUpdated(
        string indexed batchId,
        string status,
        string location,
        uint256 timestamp
    );
    
    // ============== Batch Functions ==============
    
    /**
     * @dev Create a new batch
     */
    function createBatch(
        string memory _batchId,
        string memory _productName,
        string memory _variety,
        uint256 _quantity,
        string memory _unit,
        string memory _location,
        uint256 _harvestDate,
        uint256 _expiryDate,
        string memory _nfcTagId
    ) external {
        require(!batches[_batchId].exists, "Batch already exists");
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(bytes(_productName).length > 0, "Product name cannot be empty");
        require(_quantity > 0, "Quantity must be greater than 0");
        
        batches[_batchId] = Batch({
            batchId: _batchId,
            productName: _productName,
            variety: _variety,
            quantity: _quantity,
            unit: _unit,
            location: _location,
            harvestDate: _harvestDate,
            expiryDate: _expiryDate,
            nfcTagId: _nfcTagId,
            creator: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        batchIds.push(_batchId);
        
        emit BatchCreated(_batchId, _productName, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Get batch details
     */
    function getBatch(string memory _batchId) external view returns (
        string memory productName,
        string memory variety,
        uint256 quantity,
        string memory unit,
        string memory location,
        uint256 harvestDate,
        uint256 expiryDate,
        string memory nfcTagId,
        address creator,
        uint256 timestamp
    ) {
        require(batches[_batchId].exists, "Batch does not exist");
        Batch storage batch = batches[_batchId];
        
        return (
            batch.productName,
            batch.variety,
            batch.quantity,
            batch.unit,
            batch.location,
            batch.harvestDate,
            batch.expiryDate,
            batch.nfcTagId,
            batch.creator,
            batch.timestamp
        );
    }
    
    /**
     * @dev Check if batch exists
     */
    function batchExists(string memory _batchId) external view returns (bool) {
        return batches[_batchId].exists;
    }
    
    /**
     * @dev Get total number of batches
     */
    function getTotalBatches() external view returns (uint256) {
        return batchIds.length;
    }
    
    /**
     * @dev Get all batch IDs
     */
    function getAllBatchIds() external view returns (string[] memory) {
        return batchIds;
    }
    
    // ============== Quality Metric Functions ==============
    
    /**
     * @dev Add quality metric to a batch
     */
    function addQualityMetric(
        string memory _metricId,
        string memory _batchId,
        string memory _metricType,
        string memory _value,
        string memory _unit
    ) external {
        require(batches[_batchId].exists, "Batch does not exist");
        require(!qualityMetrics[_metricId].exists, "Metric already exists");
        require(bytes(_metricId).length > 0, "Metric ID cannot be empty");
        
        qualityMetrics[_metricId] = QualityMetric({
            metricId: _metricId,
            batchId: _batchId,
            metricType: _metricType,
            value: _value,
            unit: _unit,
            timestamp: block.timestamp,
            inspector: msg.sender,
            exists: true
        });
        
        qualityMetricIds.push(_metricId);
        batchQualityMetrics[_batchId].push(_metricId);
        
        emit QualityMetricAdded(_metricId, _batchId, _metricType, msg.sender);
    }
    
    /**
     * @dev Get quality metric details
     */
    function getQualityMetric(string memory _metricId) external view returns (
        string memory batchId,
        string memory metricType,
        string memory value,
        string memory unit,
        uint256 timestamp,
        address inspector
    ) {
        require(qualityMetrics[_metricId].exists, "Metric does not exist");
        QualityMetric storage metric = qualityMetrics[_metricId];
        
        return (
            metric.batchId,
            metric.metricType,
            metric.value,
            metric.unit,
            metric.timestamp,
            metric.inspector
        );
    }
    
    /**
     * @dev Get all quality metrics for a batch
     */
    function getBatchQualityMetrics(string memory _batchId) external view returns (string[] memory) {
        return batchQualityMetrics[_batchId];
    }
    
    // ============== NFC Authentication Functions ==============
    
    /**
     * @dev Authenticate NFC tag against batch
     */
    function authenticateNFC(
        string memory _authId,
        string memory _batchId,
        string memory _nfcTagId,
        string memory _location
    ) external returns (bool) {
        require(batches[_batchId].exists, "Batch does not exist");
        require(bytes(_authId).length > 0, "Auth ID cannot be empty");
        
        // Check if NFC tag matches
        bool isValid = keccak256(bytes(_nfcTagId)) == 
                       keccak256(bytes(batches[_batchId].nfcTagId));
        
        nfcAuthentications[_authId] = NFCAuthentication({
            authId: _authId,
            batchId: _batchId,
            nfcTagId: _nfcTagId,
            timestamp: block.timestamp,
            location: _location,
            isValid: isValid
        });
        
        authenticationIds.push(_authId);
        batchAuthentications[_batchId].push(_authId);
        nfcAuthenticationCount[_nfcTagId]++;
        
        emit NFCAuthenticated(_authId, _batchId, _nfcTagId, isValid, block.timestamp);
        
        return isValid;
    }
    
    /**
     * @dev Get authentication details
     */
    function getAuthenticationDetails(string memory _authId) external view returns (
        string memory batchId,
        string memory nfcTagId,
        uint256 timestamp,
        string memory location,
        bool isValid
    ) {
        NFCAuthentication storage auth = nfcAuthentications[_authId];
        
        return (
            auth.batchId,
            auth.nfcTagId,
            auth.timestamp,
            auth.location,
            auth.isValid
        );
    }
    
    /**
     * @dev Get all authentications for a batch
     */
    function getBatchAuthentications(string memory _batchId) external view returns (string[] memory) {
        return batchAuthentications[_batchId];
    }
    
    /**
     * @dev Get authentication count for NFC tag
     */
    function getNFCAuthCount(string memory _nfcTagId) external view returns (uint256) {
        return nfcAuthenticationCount[_nfcTagId];
    }
}
