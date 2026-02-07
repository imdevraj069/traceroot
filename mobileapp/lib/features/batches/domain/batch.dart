class Batch {
  final String id;
  final String batchNumber;
  final String productName;
  final String status;
  final String origin;
  final int quantity;
  final String unit;

  Batch({
    required this.id,
    required this.batchNumber,
    required this.productName,
    required this.status,
    required this.origin,
    required this.quantity,
    required this.unit,
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
    );
  }
}
