import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:mobileapp/features/batches/presentation/batches_controller.dart';

class UpdateBatchStatusDialog extends ConsumerStatefulWidget {
  final String batchId;
  final String currentStatus;

  const UpdateBatchStatusDialog({
    super.key,
    required this.batchId,
    required this.currentStatus,
  });

  @override
  ConsumerState<UpdateBatchStatusDialog> createState() =>
      _UpdateBatchStatusDialogState();
}

class _UpdateBatchStatusDialogState
    extends ConsumerState<UpdateBatchStatusDialog> {
  late String _selectedStatus;
  bool _isGettingLocation = false;
  String? _location;

  final List<String> _statuses = [
    'CREATED',
    'IN_TRANSIT',
    'WAREHOUSE',
    'DISTRIBUTOR',
    'RETAIL',
    'DELIVERED',
  ];

  @override
  void initState() {
    super.initState();
    _selectedStatus = widget.currentStatus;
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isGettingLocation = true;
    });

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw 'Location services are disabled.';
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw 'Location permissions are denied';
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw 'Location permissions are permanently denied, we cannot request permissions.';
      }

      Position position = await Geolocator.getCurrentPosition();
      setState(() {
        _location = '${position.latitude}, ${position.longitude}';
        _isGettingLocation = false;
      });
    } catch (e) {
      setState(() {
        _location = 'Unknown Location'; // Fallback
        _isGettingLocation = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    }
  }

  void _submit() {
    if (_location == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Waiting for location...')));
      return;
    }

    ref
        .read(batchesControllerProvider.notifier)
        .updateStatus(widget.batchId, _selectedStatus, _location!);
    context.pop(); // Close dialog
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Update Status'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          DropdownButtonFormField<String>(
            value: _statuses.contains(_selectedStatus) ? _selectedStatus : null,
            items: _statuses
                .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                .toList(),
            onChanged: (val) {
              if (val != null) {
                setState(() => _selectedStatus = val);
              }
            },
            decoration: const InputDecoration(labelText: 'New Status'),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.location_on, color: Colors.grey),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _isGettingLocation
                      ? 'Fetching location...'
                      : (_location ?? 'Location not found'),
                  style: const TextStyle(fontStyle: FontStyle.italic),
                ),
              ),
              if (_isGettingLocation)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(onPressed: () => context.pop(), child: const Text('Cancel')),
        FilledButton(
          onPressed: _location != null ? _submit : null,
          child: const Text('Update'),
        ),
      ],
    );
  }
}
