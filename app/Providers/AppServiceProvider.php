<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Http\Interfaces\AccountInterface;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Interfaces\RefAttractionInterface;
use App\Http\Interfaces\RefHotelInterface;
use App\Http\Interfaces\RefVehicleInterface;
use App\Http\Interfaces\PackageHInterface;
use App\Http\Interfaces\RefZipcodeInterface;
use App\Http\Services\AccountService;
use App\Http\Services\OrderHService;
use App\Http\Services\RefAttractionService;
use App\Http\Services\RefHotelService;
use App\Http\Services\RefVehicleService;
use App\Http\Services\PackageHService;
use App\Http\Services\RefZipcodeService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AccountInterface::class, AccountService::class);
        $this->app->bind(RefAttractionInterface::class, RefAttractionService::class);
        $this->app->bind(RefHotelInterface::class, RefHotelService::class);
        $this->app->bind(RefVehicleInterface::class, RefVehicleService::class);
        $this->app->bind(PackageHInterface::class, PackageHService::class);
        $this->app->bind(RefZipcodeInterface::class, RefZipcodeService::class);
        $this->app->bind(OrderHInterface::class, OrderHService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
