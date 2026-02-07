import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobileapp/core/network/api_client.dart';
import 'package:mobileapp/features/auth/domain/user.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.read(dioProvider));
});

class AuthRepository {
  final Dio _dio;

  AuthRepository(this._dio);

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw e;
    }
  }

  Future<User> getProfile() async {
    try {
      final response = await _dio.get('/auth/profile');
      return User.fromJson(response.data);
    } catch (e) {
      throw e;
    }
  }
}
