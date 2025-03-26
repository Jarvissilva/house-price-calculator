export default function calculatePrice(formData) {
  // Base price for the project
  let totalPrice = 10000; // Starting base price (adjust as needed)

  const one_bedroom_price = 2000;
  const one_bathroom_price = 1000;
  const utility_room_price = 1500;
  const one_heat_pump_size_price = 500;
  const one_hot_water_cylinder_size_price = 10;
  const one_heating_zone_price = 100;
  const smart_controls_price = 300;
  const one_radiator_price = 150;
  const one_underfloor_heating_price = 120;
  const ventilation_system_type_prices = {
    "CMEV, Continuous Mechanical Ventilation Non Humidity inlets": 2500,
    "CMEV, with Humidity inlets": 3200,
    "DCV, Demand control Ventilation": 3800,
    "Heat Recovery Ventilation": 4500,
  };
  const ventilation_system_brand_multipliers = {
    Aldes: 1.0,
    Aereco: 1.0,
    "Vent Axia, Lindab": 1.1,
    Unitherm: 1.15,
    "Zehnder, Versatile": 1.2,
  };
  const one_wall_inlet_price = 85;
  const extract_ventilation_room_price = 120;
  const cold_water_storage_prices = {
    "Central Storage, No Tank in house / apartment": 0,
    "230 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 1250,
    "300 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 1450,
    "500 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 1850,
    "230 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 1650,
    "300 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 1950,
    "500 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 2450,
  };
  const appliances_requiring_water_prices = {
    Dishwasher: 180,
    "Washing machine": 150,
    Fridge: 220,
  };

  // number of bedrooms
  totalPrice += formData.number_of_bedrooms * one_bedroom_price;

  // number of bathrooms
  totalPrice += formData.number_of_bathrooms * one_bathroom_price;

  // Utility room addition
  if (formData.is_utility_room === "yes") {
    totalPrice += utility_room_price;
  }

  // Heating system type
  switch (formData.heating_system_type) {
    case "exhaust_air_hot_water":
      totalPrice += 5000;
      break;
    case "exhaust_air_heating":
      totalPrice += 7000;
      break;
    case "mono_bloc":
      totalPrice += 6000;
      break;
    case "split_type":
      totalPrice += 8000;
      break;
    default:
      totalPrice += 5000;
  }

  // Heat pump size
  totalPrice +=
    parseInt(formData.heatpump_size || 0) * one_heat_pump_size_price;

  // Hot water cylinder
  totalPrice +=
    parseInt(formData.hot_water_cylinder_size || 0) *
    one_hot_water_cylinder_size_price;

  const calculateHeatPumpRequirementsCost = () => {
    if (
      !formData.heatpump_requirements ||
      formData.heatpump_requirements.length === 0
    ) {
      return 0;
    }

    const requirementPrices = {
      "Fridge pipe & F-Gas Engineer (only if split type)": {
        price: 495,
        validFor: ["split_type"],
      },
      "32mm F& R to outside unit from hotpress (if mono bloc)": {
        price: 325,
        validFor: ["mono_bloc"],
      },
      "Insulated ductwork to external facade (if Exhaust Air)": {
        price: 650,
        validFor: ["exhaust_air_hot_water", "exhaust_air_heating"],
      },
      Driptray: {
        price: 125,
        validFor: "all",
      },
      "Un-vented kit": {
        price: 375,
        validFor: "all",
      },
      Feet: {
        price: 85,
        validFor: "all",
      },
    };

    return formData.heatpump_requirements.reduce((total, requirement) => {
      const spec = requirementPrices[requirement];
      if (!spec) return total;

      if (
        spec.validFor === "all" ||
        spec.validFor.includes(formData.heating_system_type)
      ) {
        return total + spec.price;
      }
      return total;
    }, 0);
  };

  totalPrice += calculateHeatPumpRequirementsCost();

  // number of heating zones
  totalPrice += formData.number_of_heating_zones * one_heating_zone_price;

  // Smart controls
  if (formData.is_smart_controls === "yes") {
    totalPrice += smart_controls_price;
  }

  // Heating type (radiators or underfloor)
  if (formData.heating_type.includes("Radiators")) {
    totalPrice += formData.quantity_of_radiators * one_radiator_price;
  }
  if (formData.heating_type.includes("Underfloor heating")) {
    totalPrice +=
      formData.square_meters_underfloor_heating * one_underfloor_heating_price;
  }

  // Ventilation system
  let ventilationCost;
  if (formData.ventilation_system_type) {
    ventilationCost +=
      ventilation_system_type_prices[formData.ventilation_system_type] || 0;

    // Apply brand multiplier
    if (formData.ventilation_system_brand) {
      ventilationCost *=
        ventilation_system_brand_multipliers[
          formData.ventilation_system_brand
        ] || 1.0;
    }
  }

  // Wall inlets (supply grilles)
  ventilationCost +=
    (formData.number_of_wall_inlets || 0) * one_wall_inlet_price;

  // Extract ventilation points
  ventilationCost +=
    (formData.extract_ventilation_rooms?.length || 0) *
    extract_ventilation_room_price;

  // Independent validation
  if (formData.is_independent_validation === "yes") {
    ventilationCost += 750; // Validation fee
  }

  // Add ventilation cost to total (only if utility room exists)
  if (formData.is_utility_room === "yes") {
    totalPrice += ventilationCost;
  }

  if (formData.cold_water_storage) {
    totalPrice += cold_water_storage_prices[formData.cold_water_storage] || 0;
  }

  // Appliances Requiring Water & Waste

  if (formData.appliances_requiring_water?.length > 0) {
    totalPrice += formData.appliances_requiring_water.reduce(
      (sum, appliance) => {
        return sum + (appliances_requiring_water_prices[appliance] || 0);
      },
      0
    );
  }

  // Sanitary ware
  if (formData.sanitary_ware.includes("Supply & Fit")) {
    totalPrice += formData.number_of_toilets * 400;
    totalPrice += formData.number_of_wash_hand_basins * 250;
    totalPrice += formData.number_of_baths * 600;
    totalPrice += formData.number_of_showers * 800;
  } else {
    // Just installation
    totalPrice += formData.number_of_toilets * 200;
    totalPrice += formData.number_of_wash_hand_basins * 150;
    totalPrice += formData.number_of_baths * 300;
    totalPrice += formData.number_of_showers * 400;
  }

  const sanitaryBrandMultipliers = {
    Sonas: 1.0, // Standard
    "Ideal Standard": 1.15, // 15% premium
    "Niko Bathrooms": 1.25, // 25% premium (luxury brand)
  };

  // Base Prices
  const sanitaryBasePrices = {
    toilet: 220,
    washBasin: 180,
    bath: 450,
    shower: 600,
  };

  // Tap Type Prices
  const tapPrices = {
    "2 taps": 80,
    "Mono bloc tap": 120,
    "Thermostatic Mono bloc tap": 200,
  };

  // Bath Tap Prices
  const bathTapPrices = {
    "Bath taps": 100,
    "Bath shower mixer": 250,
  };

  // Shower Mixer Prices
  const showerMixerPrices = {
    "Tee Bar": 150,
    Concealed: 300,
  };

  // Accessibility Features
  const accessibilityPrices = {
    bathScreen: 180,
    showerDoor: 220,
    docMWCPack: 350,
    docMShowerPack: 450,
    handRail: 85,
    dropDownRail: 120,
  };

  // Fire Safety
  const fireSafetyPrices = {
    "Fire Extinguisher": 120,
    "Fire Blanket": 65,
  };

  // Landlord Services
  const landlordServicePrices = {
    "Dry Riser": 2500,
    "Landlord Mains water services": 1800,
    "Basement slung drainage (Soils & Wastes)": 3200,
    "Basement slung drainage (Rainwater disposal)": 2800,
    "Carpark ventilation / smoke control": 4500,
    "Stair lobby ventilation": 2200,
    "Bin store ventilation": 1800,
    "Stairwell pressurisation & smoke control": 6500,
    "Stairwell AOV's (Automatic opening vents)": 3800,
    "District Heating Plantroom": 8500,
    "District Heating Distribution": 4200,
  };

  // Calculate Sanitary Ware Costs
  let sanitaryCost = 0;

  // Apply brand multiplier
  const brandMultiplier =
    sanitaryBrandMultipliers[formData.sanitary_ware_brand] || 1.0;

  // Toilets
  sanitaryCost +=
    (formData.number_of_toilets || 0) *
    sanitaryBasePrices.toilet *
    brandMultiplier;

  // Wash Hand Basins
  sanitaryCost +=
    (formData.number_of_wash_hand_basins || 0) *
    sanitaryBasePrices.washBasin *
    brandMultiplier;

  // WHB Taps
  if (formData.whb_taps) {
    sanitaryCost +=
      (formData.number_of_wash_hand_basins || 0) *
      (tapPrices[formData.whb_taps] || 0);
  }

  // Baths
  sanitaryCost +=
    (formData.number_of_baths || 0) * sanitaryBasePrices.bath * brandMultiplier;

  // Bath Screens
  if (formData.number_of_bath_screens === "yes") {
    sanitaryCost +=
      (formData.number_of_baths || 0) * accessibilityPrices.bathScreen;
  }

  // Bath Taps
  if (formData.bath_taps) {
    sanitaryCost +=
      (formData.number_of_baths || 0) *
      (bathTapPrices[formData.bath_taps] || 0);
  }

  // Showers
  sanitaryCost +=
    (formData.number_of_showers || 0) *
    sanitaryBasePrices.shower *
    brandMultiplier;

  // Shower Mixers
  if (formData.shower_mixer) {
    sanitaryCost +=
      (formData.number_of_showers || 0) *
      (showerMixerPrices[formData.shower_mixer] || 0);
  }

  // Shower Doors
  if (formData.shower_doors === "yes") {
    sanitaryCost +=
      (formData.number_of_showers || 0) * accessibilityPrices.showerDoor;
  }

  // Accessibility Packages
  if (formData.standard_doc_m_wc_pack === "yes") {
    sanitaryCost += accessibilityPrices.docMWCPack;
  }
  if (formData.is_doc_m_pack_shower === "yes") {
    sanitaryCost += accessibilityPrices.docMShowerPack;
  }

  // Additional Rails
  sanitaryCost +=
    (formData.qty_additional_hand_rails || 0) * accessibilityPrices.handRail;
  sanitaryCost +=
    (formData.qty_additional_drop_down_rails || 0) *
    accessibilityPrices.dropDownRail;

  // Add sanitary costs to total
  totalPrice += sanitaryCost;

  // Fire Safety Equipment
  if (formData.fire_safety_equipment?.length > 0) {
    totalPrice += formData.fire_safety_equipment.reduce((sum, item) => {
      return sum + (fireSafetyPrices[item] || 0);
    }, 0);
  }

  // Fire Proofing
  if (formData.is_fire_proofing === "yes") {
    totalPrice += 2000; // Comprehensive fire proofing
  }

  // Grounds Work
  if (formData.is_grounds === "yes") {
    totalPrice += 3500; // Basic landscaping and groundworks
  }

  // Landlord Services (for apartments)
  if (formData.landlord_services?.length > 0) {
    totalPrice += formData.landlord_services.reduce((sum, service) => {
      return sum + (landlordServicePrices[service] || 0);
    }, 0);
  }

  return totalPrice;
}
