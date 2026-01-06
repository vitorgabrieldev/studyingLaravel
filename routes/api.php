<?php

use App\Http\Controllers\Customers\IndexController;
use Illuminate\Support\Facades\Route;

Route::post('service-layers', [IndexController::class, 'store']);