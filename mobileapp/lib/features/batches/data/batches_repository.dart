import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/core/network/api_client.dart';
import 'package:mobileapp/features/batches/domain/batch.dart';

final batchesRepositoryProvider = Provider<BatchesRepository>((ref) {
  return BatchesRepository(ref.read(traceDioProvider));
});

class BatchesRepository {
  final Dio _dio;

  BatchesRepository(this._dio);

  Future<List<Batch>> getBatches() async {
    try {
      final response = await _dio.get('/batches');
      return (response.data as List).map((e) => Batch.fromJson(e)).toList();
    } catch (e) {
      throw e;
    }
  }

  Future<Batch> getBatchById(String id) async {
    try {
      final response = await _dio.get('/batches/$id');
      return Batch.fromJson(response.data);
    } catch (e) {
      throw e;
    }
  }

  Future<void> createBatch(Map<String, dynamic> data) async {
    try {
      await _dio.post('/batches', data: data);
    } catch (e) {
      throw e;
    }
  }

  Future<Batch> getPublicBatchById(String id) async {
    try {
      final response = await _dio.get('/public/batch/$id');
      return Batch.fromJson(response.data);
    } catch (e) {
      throw e;
    }
  }

  Future<void> updateStatus(String id, String status, String location) async {
    try {
      await _dio.put(
        '/batches/$id/status',
        data: {'status': status, 'location': location},
      );
    } catch (e) {
      throw e;
    }
  }
}
