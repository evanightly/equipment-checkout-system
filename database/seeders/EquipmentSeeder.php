<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment = [
            // Microphones
            [
                'name' => 'Wireless Lavalier Microphone',
                'code' => 'MIC-LAV-001',
                'type' => 'Microphone',
                'description' => 'Professional wireless lavalier microphone for interviews',
                'brand' => 'Sennheiser',
                'model' => 'EW 112P G4',
                'serial_number' => 'SEN-EW112-001',
                'status' => 'available',
                'purchase_price' => 2500000.00,
                'purchase_date' => '2024-01-15',
                'location' => 'Audio Room A',
                'is_active' => true,
            ],
            [
                'name' => 'Shotgun Microphone',
                'code' => 'MIC-SHT-001',
                'type' => 'Microphone',
                'description' => 'Directional shotgun microphone for field recording',
                'brand' => 'Audio-Technica',
                'model' => 'AT897',
                'serial_number' => 'AT-897-001',
                'status' => 'available',
                'purchase_price' => 1800000.00,
                'purchase_date' => '2024-02-20',
                'location' => 'Equipment Storage',
                'is_active' => true,
            ],

            // Cameras
            [
                'name' => 'Professional Video Camera',
                'code' => 'CAM-PRO-001',
                'type' => 'Camera',
                'description' => '4K professional video camera for studio and field production',
                'brand' => 'Sony',
                'model' => 'FX6',
                'serial_number' => 'SNY-FX6-001',
                'status' => 'borrowed',
                'purchase_price' => 85000000.00,
                'purchase_date' => '2023-12-10',
                'location' => 'Camera Storage',
                'is_active' => true,
            ],
            [
                'name' => 'DSLR Camera',
                'code' => 'CAM-DSLR-001',
                'type' => 'Camera',
                'description' => 'High-resolution DSLR camera for photography and video',
                'brand' => 'Canon',
                'model' => 'EOS R5',
                'serial_number' => 'CAN-R5-001',
                'status' => 'available',
                'purchase_price' => 45000000.00,
                'purchase_date' => '2024-03-05',
                'location' => 'Camera Storage',
                'is_active' => true,
            ],

            // Audio Mixers
            [
                'name' => 'Digital Audio Mixer',
                'code' => 'MIX-DIG-001',
                'type' => 'Mixer',
                'description' => '32-channel digital audio mixing console',
                'brand' => 'Yamaha',
                'model' => 'QL1',
                'serial_number' => 'YMH-QL1-001',
                'status' => 'available',
                'purchase_price' => 75000000.00,
                'purchase_date' => '2023-11-15',
                'location' => 'Control Room',
                'is_active' => true,
            ],

            // Tripods
            [
                'name' => 'Heavy Duty Tripod',
                'code' => 'TRI-HVY-001',
                'type' => 'Tripod',
                'description' => 'Heavy duty tripod for professional cameras',
                'brand' => 'Manfrotto',
                'model' => '546B',
                'serial_number' => 'MAN-546B-001',
                'status' => 'available',
                'purchase_price' => 8500000.00,
                'purchase_date' => '2024-01-20',
                'location' => 'Equipment Storage',
                'is_active' => true,
            ],
            [
                'name' => 'Carbon Fiber Tripod',
                'code' => 'TRI-CF-001',
                'type' => 'Tripod',
                'description' => 'Lightweight carbon fiber tripod for portable shooting',
                'brand' => 'Gitzo',
                'model' => 'GT3543XLS',
                'serial_number' => 'GTZ-3543-001',
                'status' => 'maintenance',
                'purchase_price' => 12000000.00,
                'purchase_date' => '2023-10-08',
                'location' => 'Maintenance Room',
                'is_active' => true,
            ],

            // Recorders
            [
                'name' => 'Portable Audio Recorder',
                'code' => 'REC-PRT-001',
                'type' => 'Recorder',
                'description' => 'Portable digital audio recorder for field recording',
                'brand' => 'Zoom',
                'model' => 'F8n',
                'serial_number' => 'ZOM-F8N-001',
                'status' => 'available',
                'purchase_price' => 15000000.00,
                'purchase_date' => '2024-02-14',
                'location' => 'Audio Room B',
                'is_active' => true,
            ],

            // Lighting
            [
                'name' => 'LED Panel Light',
                'code' => 'LGT-LED-001',
                'type' => 'Lighting',
                'description' => 'Adjustable LED panel light for studio lighting',
                'brand' => 'Aputure',
                'model' => 'AL-MX',
                'serial_number' => 'APT-MX-001',
                'status' => 'available',
                'purchase_price' => 3500000.00,
                'purchase_date' => '2024-01-30',
                'location' => 'Lighting Storage',
                'is_active' => true,
            ],
            [
                'name' => 'Studio Light Kit',
                'code' => 'LGT-KIT-001',
                'type' => 'Lighting',
                'description' => 'Complete studio lighting kit with stands and softboxes',
                'brand' => 'Godox',
                'model' => 'SK400II-3',
                'serial_number' => 'GDX-SK400-001',
                'status' => 'damaged',
                'purchase_price' => 8000000.00,
                'purchase_date' => '2023-09-12',
                'location' => 'Repair Shop',
                'is_active' => false,
            ],
        ];

        foreach ($equipment as $item) {
            // Add missing fields that are required by the model
            $item['is_available_for_borrowing'] = $item['status'] === 'available';
            $item['division_id'] = null; // No division assigned initially

            Equipment::create($item);
        }
    }
}
