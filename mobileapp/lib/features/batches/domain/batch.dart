class Batch {
  final String id;
  final String batchNumber;
  final String productName;
  final String status;
  final String origin;
  final int quantity;
  final String unit;

  final List<BatchHistoryItem> history;

  Batch({
    required this.id,
    required this.batchNumber,
    required this.productName,
    required this.status,
    required this.origin,
    required this.quantity,
    required this.unit,
    this.history = const [],
  });

  factory Batch.fromJson(Map<String, dynamic> json) {
    return Batch(
      id: json['_id'] ?? '',
      batchNumber: json['batchNumber'] ?? '',
      productName: json['productName'] ?? '',
      status: json['status'] ?? 'CREATED',
      origin: json['origin'] ?? '',
      quantity: json['quantity'] ?? 0,
      unit: json['unit'] ?? '',
      history:
          (json['history'] as List?)
              ?.map((e) => BatchHistoryItem.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class BatchHistoryItem {
  final String status;
  final String timestamp;
  final String location;
  final String? txHash;

  BatchHistoryItem({
    required this.status,
    required this.timestamp,
    required this.location,
    this.txHash,
  });

  factory BatchHistoryItem.fromJson(Map<String, dynamic> json) {
    return BatchHistoryItem(
      status: json['status'] ?? '',
      timestamp: json['timestamp'] ?? '',
      location: json['location'] ?? '',
      txHash: json['txHash'],
    );
  }
}
