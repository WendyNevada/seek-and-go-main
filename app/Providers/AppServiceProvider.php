<?php

namespace App\Providers;

use App\Http\Services\TrxService;
use App\Http\Services\PromoService;
use App\Http\Services\OrderHService;
use App\Http\Interfaces\TrxInterface;
use App\Http\Services\AccountService;
use App\Http\Services\PackageHService;
use App\Http\Services\RefHotelService;
use App\Http\Interfaces\PromoInterface;
use Illuminate\Support\ServiceProvider;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Services\RefVehicleService;
use App\Http\Services\RefZipcodeService;
use App\Http\Interfaces\AccountInterface;
use App\Http\Interfaces\PackageHInterface;
use App\Http\Interfaces\RefHotelInterface;
use App\Http\Services\AgencyPaymentService;
use App\Http\Services\RefAttractionService;
use App\Http\Interfaces\RefVehicleInterface;
use App\Http\Interfaces\RefZipcodeInterface;
use App\Http\Services\AgencyAffiliateService;
use App\Http\Interfaces\AgencyPaymentInterface;
use App\Http\Interfaces\RefAttractionInterface;
use App\Http\Interfaces\AgencyAffiliateInterface;

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
        $this->app->bind(TrxInterface::class, TrxService::class);
        $this->app->bind(PromoInterface::class, PromoService::class);
        $this->app->bind(AgencyAffiliateInterface::class, AgencyAffiliateService::class);
        $this->app->bind(AgencyPaymentInterface::class, AgencyPaymentService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
