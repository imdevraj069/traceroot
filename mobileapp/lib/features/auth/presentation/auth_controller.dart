import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobileapp/features/auth/data/auth_repository.dart';
import 'package:mobileapp/features/auth/domain/user.dart';

final authControllerProvider =
    StateNotifierProvider<AuthController, AsyncValue<User?>>((ref) {
      return AuthController(ref.read(authRepositoryProvider));
    });

class AuthController extends StateNotifier<AsyncValue<User?>> {
  final AuthRepository _authRepository;
  final _storage = const FlutterSecureStorage();

  AuthController(this._authRepository) : super(const AsyncValue.data(null));

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _authRepository.login(email, password);
      await _storage.write(key: 'accessToken', value: response.accessToken);
      await _storage.write(key: 'refreshToken', value: response.refreshToken);
      state = AsyncValue.data(response.user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'accessToken');
    await _storage.delete(key: 'refreshToken');
    state = const AsyncValue.data(null);
  }

  Future<void> checkAuth() async {
    state = const AsyncValue.loading();
    try {
      final token = await _storage.read(key: 'accessToken');
      if (token != null) {
        final user = await _authRepository.getProfile();
        state = AsyncValue.data(user);
      } else {
        state = const AsyncValue.data(null);
      }
    } catch (e) {
      state = const AsyncValue.data(null);
    }
  }
}
