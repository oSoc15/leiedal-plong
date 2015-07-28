<?php

use Illuminate\Database\Seeder;
use App\Models\Residence;

class ResidenceTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        Residence::create(array(
            "street"     => "Felix Timmermansstraat",
            "city"       => "Zele",
            "number"     => "5",
            "postalCode" => 9240,
            "lat"        => 1.2222,
            "lon"        => 1.2222
        ));
    }
}
