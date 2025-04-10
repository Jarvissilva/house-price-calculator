"use client";
import { useState } from "react";
import {
  CustomTextInput,
  MultiCheckBoxSelect,
  RadioInput,
} from "components/form";
import { FileUpload } from "components/form";
import { SelectInput } from "components/form";
import { TextInput } from "components/form";
import generatePdf from "actions/generatePdf";

export default function Page() {
  const [formData, setFormData] = useState({
    tender_number: "",
    client_name: "",
    client_representative: "",
    phone_number: "",
    email: "",
    due_date: "",
    house_type: "",
    number_of_bedrooms: 0,
    number_of_bathrooms: 0,
    is_utility_room: null,
    heating_system_type: "",
    heatpump_brand: "",
    heatpump_size: "",
    hot_water_cylinder_size: "",
    proposed_supplier_heatpump: "",
    heatpump_requirements: [],
    number_of_heating_zones: "",
    is_smart_controls: "",
    proposed_supplier_controls: "",
    heating_type: [],
    quantity_of_radiators: "",
    square_meters_underfloor_heating: "",
    proposed_supplier_radiators: "",
    ventilation_system_type: "",
    number_of_wall_inlets: "",
    extract_ventilation_rooms: [],
    ventilation_system_brand: "",
    is_independent_validation: "",
    proposed_supplier_ventilation: "",
    cold_water_storage: "",
    proposed_supplier_water_tank: "",
    appliances_requiring_water: [],
    sanitary_ware: [],
    sanitary_ware_brand: "",
    number_of_toilets: "",
    number_of_wash_hand_basins: "",
    whb_taps: "",
    number_of_baths: "",
    number_of_bath_screens: "",
    bath_taps: "",
    number_of_showers: "",
    shower_mixer: "",
    shower_doors: "",
    standard_doc_m_wc_pack: "",
    is_doc_m_pack_shower: "",
    qty_additional_hand_rails: "",
    qty_additional_drop_down_rails: "",
    fire_safety_equipment: [],
    is_fire_proofing: "",
    is_grounds: "",
    landlord_services: [],
  });

  const [basePrices, setBasePrices] = useState({
    bedroom: 20000, // per bedroom
    bathroom: 15000, // per bathroom
    utilityRoom: 5000,

    // Heating system
    heatingSystem: {
      exhaust_air_hot_water: 8000,
      exhaust_air_heating: 10000,
      mono_bloc: 12000,
      split_type: 15000,
    },
    heatpumpBrand: {
      LG: 8500,
      "E-Ven": 7500,
      Hitachi: 9000,
      Panasonic: 9500,
      Media: 7000,
      Mitsubishi: 10000,
      Daikin: 11000,
      Samsung: 8000,
      Joule: 8500,
      Nilan: 9000,
      Greentherm: 7500,
      Dimplex: 8000,
    },
    heatpumpSize: 500,
    hotWaterCylinder: {
      150: 800,
      180: 900,
      200: 1000,
      210: 1100,
      250: 1200,
      300: 1500,
    },
    heatpumpRequirements: {
      "Fridge pipe & F-Gas Engineer (only if split type)": 1200,
      "32mm F& R to outside unit from hotpress (if mono bloc)": 800,
      "Insulated ductwork to external facade (if Exhaust Air)": 600,
      Driptray: 150,
      "Un-vented kit": 300,
      Feet: 100,
    },
    heatingZones: 500, // per zone
    smartControls: 1200,

    // Heating distribution
    radiator: 250, // per radiator
    underfloorHeating: 75, // per sqm

    // Ventilation system (if utility room exists)
    ventilationSystem: {
      "CMEV, Continuous Mechanical Ventilation Non Humidity inlets": 3500,
      "CMEV, with Humidity inlets": 4000,
      "DCV, Demand control Ventilation": 4500,
      "Heat Recovery Ventilation": 5000,
    },
    wallInlet: 150, // per inlet
    extractVentilationRoom: 300, // per room
    ventilationBrand: {
      Aldes: 4000,
      Aereco: 3500,
      "Vent Axia, Lindab": 3800,
      Unitherm: 4200,
      "Zehnder, Versatile": 4500,
    },
    independentValidation: 2000,

    // Water systems
    coldWaterStorage: {
      "Central Storage, No Tank in house / apartment": 0,
      "230 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 1800,
      "300 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 2200,
      "500 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)": 2800,
      "230 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 2000,
      "300 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 2400,
      "500 Litre coffin tank, c/w lid, insulation & separate cold water booster pump": 3000,
    },
    waterAppliance: {
      Dishwasher: 300,
      "Washing machine": 300,
      Fridge: 400,
    },

    // Sanitary ware
    sanitaryWareOption: {
      "Fit only": 0, // Only labor costs would apply
      "Supply & Fit": 1, // Multiplier for material costs
    },
    sanitaryWareBrand: {
      Sonas: 1.0, // Base multiplier
      "Ideal Standard": 1.2,
      "Niko Bathrooms": 1.3,
    },
    toilet: 400, // per toilet
    washHandBasin: 250, // per basin
    whbTaps: {
      "2 taps": 120,
      "Mono bloc tap": 150,
      "Thermostatic Mono bloc tap": 200,
    },
    bath: 600, // per bath
    bathScreen: 350, // per screen
    bathTaps: {
      "Bath taps": 150,
      "Bath shower mixer": 250,
    },
    shower: {
      basic: 800, // per shower
      premium: 1200, // per shower
    },
    showerMixer: {
      "Tee Bar": 200,
      Concealed: 300,
    },
    showerDoors: 400, // per set
    docMWcPack: 500,
    docMShowerPack: 800,
    handRail: 120, // per rail
    dropDownRail: 150, // per rail

    // Fire safety
    fireEquipment: {
      "Fire Extinguisher": 150,
      "Fire Blanket": 80,
      Excluded: 0,
    },
    fireProofing: 3000,

    // Grounds
    groundsWork: 5000,

    // Landlord services (for apartments)
    landlordServices: {
      "Dry Riser": 8000,
      "Landlord Mains water services": 5000,
      "Basement slung drainage (Soils & Wastes)": 6000,
      "Basement slung drainage (Rainwater disposal)": 5500,
      "Carpark ventilation / smoke control": 7000,
      "Stair lobby ventilation": 4500,
      "Bin store ventilation": 3500,
      "Stairwell pressurisation & smoke control": 9000,
      "Stairwell AOV's (Automatic opening vents)": 6500,
      "District Heating Plantroom": 15000,
      "District Heating Distribution": 12000,
    },

    // Labor costs
    laborMultiplier: 0.3, // 30% of material costs
    installationFee: 5000, // Base installation fee
  });

  const [prices, setPrices] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let temp = [];
    let subtotal = 0;

    // Property Basics
    if (formData.number_of_bedrooms > 0) {
      const cost = basePrices.bedroom * formData.number_of_bedrooms;
      temp.push({ name: "Bedrooms", cost, info: formData.number_of_bedrooms });
      subtotal += cost;
    }

    if (formData.number_of_bathrooms > 0) {
      const cost = basePrices.bathroom * formData.number_of_bathrooms;
      temp.push({
        name: "Bathrooms",
        cost,
        info: formData.number_of_bathrooms,
      });
      subtotal += cost;
    }

    if (formData.is_utility_room === "yes") {
      temp.push({
        name: "Utility Room",
        cost: basePrices.utilityRoom,
        info: formData.is_utility_room,
      });
      subtotal += basePrices.utilityRoom;
    }

    // Heating System
    if (formData.heating_system_type) {
      const cost = basePrices.heatingSystem[formData.heating_system_type] || 0;
      temp.push({
        name: "Heating System",
        cost,
        info: formData.heating_system_type,
      });
      subtotal += cost;
    }

    if (formData.heatpump_brand) {
      const cost = basePrices.heatpumpBrand[formData.heatpump_brand] || 0;
      temp.push({
        name: "Heatpump Brand",
        cost,
        info: formData.heatpump_brand,
      });
      subtotal += cost;
    }

    if (formData.heatpump_size) {
      const cost = basePrices.heatpumpSize * formData.heatpump_size;
      temp.push({ name: "Heatpump Size", cost, info: formData.heatpump_size });
      subtotal += cost;
    }

    if (formData.hot_water_cylinder_size) {
      const cost =
        basePrices.hotWaterCylinder[formData.hot_water_cylinder_size] || 0;
      temp.push({
        name: "Water Cylinder",
        cost,
        info: formData.hot_water_cylinder_size,
      });
      subtotal += cost;
    }

    // Heatpump Requirements
    if (formData.heatpump_requirements.length > 0) {
      const requirementsCost = formData.heatpump_requirements.reduce(
        (total, req) => total + (basePrices.heatpumpRequirements[req] || 0),
        0
      );
      temp.push({
        name: "Heatpump Requirements",
        cost: requirementsCost,
        info: formData.heatpump_requirements,
      });
      subtotal += requirementsCost;
    }

    // Heating Zones
    if (formData.number_of_heating_zones) {
      const cost = basePrices.heatingZones * formData.number_of_heating_zones;
      temp.push({
        name: "Heating Zones",
        cost,
        info: formData.number_of_heating_zones,
      });
      subtotal += cost;
    }

    // Smart Controls
    if (formData.is_smart_controls === "yes") {
      temp.push({
        name: "Smart Controls",
        cost: basePrices.smartControls,
        info: formData.is_smart_controls,
      });
      subtotal += basePrices.smartControls;
    }

    // Heating Distribution
    if (
      formData.heating_type.includes("Radiators") &&
      formData.quantity_of_radiators
    ) {
      const cost = basePrices.radiator * formData.quantity_of_radiators;
      temp.push({
        name: "Radiators",
        cost,
        info: formData.quantity_of_radiators,
      });
      subtotal += cost;
    }

    if (
      formData.heating_type.includes("Underfloor heating") &&
      formData.square_meters_underfloor_heating
    ) {
      const cost =
        basePrices.underfloorHeating *
        formData.square_meters_underfloor_heating;
      temp.push({
        name: "Underfloor Heating",
        cost,
        info: formData.square_meters_underfloor_heating,
      });
      subtotal += cost;
    }

    // Ventilation System (if utility room exists)
    if (formData.is_utility_room === "yes") {
      if (formData.ventilation_system_type) {
        const cost =
          basePrices.ventilationSystem[formData.ventilation_system_type] || 0;
        temp.push({
          name: "Ventilation System",
          cost,
          info: formData.ventilation_system_type,
        });
        subtotal += cost;
      }

      if (formData.number_of_wall_inlets) {
        const cost = basePrices.wallInlet * formData.number_of_wall_inlets;
        temp.push({
          name: "Wall Inlets",
          cost,
          info: formData.number_of_wall_inlets,
        });
        subtotal += cost;
      }

      if (formData.extract_ventilation_rooms.length > 0) {
        const cost =
          basePrices.extractVentilationRoom *
          formData.extract_ventilation_rooms.length;
        temp.push({
          name: "Extract Ventilation Rooms",
          cost,
          info: formData.extract_ventilation_rooms,
        });
        subtotal += cost;
      }

      if (formData.ventilation_system_brand) {
        const cost =
          basePrices.ventilationBrand[formData.ventilation_system_brand] || 0;
        temp.push({
          name: "Ventilation Brand",
          cost,
          info: formData.ventilation_system_brand,
        });
        subtotal += cost;
      }

      if (formData.is_independent_validation === "yes") {
        temp.push({
          name: "Independent Validation",
          cost: basePrices.independentValidation,
          info: formData.is_independent_validation,
        });
        subtotal += basePrices.independentValidation;
      }
    }

    // Water Systems
    if (formData.cold_water_storage) {
      const cost =
        basePrices.coldWaterStorage[formData.cold_water_storage] || 0;
      temp.push({
        name: "Cold Water Storage",
        cost,
        info: formData.cold_water_storage,
      });
      subtotal += cost;
    }

    // Appliances requiring water
    if (formData.appliances_requiring_water.length > 0) {
      const appliancesCost = formData.appliances_requiring_water.reduce(
        (total, appliance) => {
          return total + (basePrices.waterAppliance[appliance] || 0);
        },
        0
      );
      temp.push({
        name: "Water Appliances",
        cost: appliancesCost,
        info: formData.appliances_requiring_water,
      });
      subtotal += appliancesCost;
    }

    // Sanitary Ware
    if (formData.sanitary_ware.length > 0) {
      const sanitaryMultiplier = formData.sanitary_ware.includes("Supply & Fit")
        ? basePrices.sanitaryWareOption["Supply & Fit"]
        : basePrices.sanitaryWareOption["Fit only"];

      let sanitaryCost = 0;

      if (formData.number_of_toilets) {
        sanitaryCost += basePrices.toilet * formData.number_of_toilets;
      }

      if (formData.number_of_wash_hand_basins) {
        sanitaryCost +=
          basePrices.washHandBasin * formData.number_of_wash_hand_basins;
      }

      if (formData.whb_taps) {
        sanitaryCost += basePrices.whbTaps[formData.whb_taps] || 0;
      }

      if (formData.number_of_baths) {
        sanitaryCost += basePrices.bath * formData.number_of_baths;
      }

      if (formData.number_of_bath_screens === "yes") {
        sanitaryCost += basePrices.bathScreen * (formData.number_of_baths || 1);
      }

      if (formData.bath_taps) {
        sanitaryCost += basePrices.bathTaps[formData.bath_taps] || 0;
      }

      if (formData.number_of_showers) {
        sanitaryCost += basePrices.shower.basic * formData.number_of_showers; // Using basic shower price
      }

      if (formData.shower_mixer) {
        sanitaryCost += basePrices.showerMixer[formData.shower_mixer] || 0;
      }

      if (formData.shower_doors === "yes") {
        sanitaryCost +=
          basePrices.showerDoors * (formData.number_of_showers || 1);
      }

      if (formData.sanitary_ware_brand) {
        sanitaryCost *=
          basePrices.sanitaryWareBrand[formData.sanitary_ware_brand] || 1;
      }

      sanitaryCost *= sanitaryMultiplier;

      if (sanitaryCost > 0) {
        temp.push({
          name: "Sanitary Ware",
          cost: sanitaryCost,
          info: formData.sanitary_ware,
        });
        subtotal += sanitaryCost;
      }
    }

    // Additional Features
    if (formData.standard_doc_m_wc_pack === "yes") {
      temp.push({
        name: "Doc-M WC Pack",
        cost: basePrices.docMWcPack,
        info: formData.standard_doc_m_wc_pack,
      });
      subtotal += basePrices.docMWcPack;
    }

    if (formData.is_doc_m_pack_shower === "yes") {
      temp.push({
        name: "Doc-M Shower Pack",
        cost: basePrices.docMShowerPack,
        info: formData.is_doc_m_pack_shower,
      });
      subtotal += basePrices.docMShowerPack;
    }

    if (formData.qty_additional_hand_rails) {
      const cost = basePrices.handRail * formData.qty_additional_hand_rails;
      temp.push({
        name: "Hand Rails",
        cost,
        info: formData.qty_additional_hand_rails,
      });
      subtotal += cost;
    }

    if (formData.qty_additional_drop_down_rails) {
      const cost =
        basePrices.dropDownRail * formData.qty_additional_drop_down_rails;
      temp.push({
        name: "Drop Down Rails",
        cost,
        info: formData.qty_additional_drop_down_rails,
      });
      subtotal += cost;
    }

    // Fire Safety
    if (formData.fire_safety_equipment.length > 0) {
      const fireSafetyCost = formData.fire_safety_equipment.reduce(
        (total, item) => {
          return total + (basePrices.fireEquipment[item] || 0);
        },
        0
      );
      temp.push({
        name: "Fire Safety Equipment",
        cost: fireSafetyCost,
        info: formData.fire_safety_equipment,
      });
      subtotal += fireSafetyCost;
    }

    if (formData.is_fire_proofing === "yes") {
      temp.push({
        name: "Fire Proofing",
        cost: basePrices.fireProofing,
        info: formData.is_fire_proofing,
      });
      subtotal += basePrices.fireProofing;
    }

    // Grounds
    if (formData.is_grounds === "yes") {
      temp.push({
        name: "Grounds Work",
        cost: basePrices.groundsWork,
        info: formData.is_grounds,
      });
      subtotal += basePrices.groundsWork;
    }

    // Landlord Services
    if (formData.landlord_services.length > 0) {
      const landlordServicesCost = formData.landlord_services.reduce(
        (total, service) => {
          return total + (basePrices.landlordServices[service] || 0);
        },
        0
      );
      temp.push({
        name: "Landlord Services",
        cost: landlordServicesCost,
        info: formData.landlord_services,
      });
      subtotal += landlordServicesCost;
    }
    // Add labor and installation
    const laborCost = subtotal * basePrices.laborMultiplier;
    temp.push({ name: "Labor Costs", cost: laborCost });

    temp.push({ name: "Installation Fee", cost: basePrices.installationFee });

    // Calculate total
    const total = subtotal + laborCost + basePrices.installationFee;
    temp.push({ name: "TOTAL", cost: total, isTotal: true });

    setPrices(temp);
  };

  const fillDemoData = () => {
    setFormData({
      tender_number: "TND-2023-001",
      client_name: "John Smith",
      client_representative: "Sarah Johnson",
      phone_number: "1234567890",
      email: "john.smith@example.com",
      due_date: "2023-12-31",
      house_type: "detached",
      number_of_bedrooms: 3,
      number_of_bathrooms: 2,
      is_utility_room: "yes",
      heating_system_type: "mono_bloc",
      heatpump_brand: "Mitsubishi",
      heatpump_size: "5",
      hot_water_cylinder_size: "200",
      proposed_supplier_heatpump: "HeatPump Suppliers Ltd",
      heatpump_requirements: [
        "Fridge pipe & F-Gas Engineer (only if split type)",
        "Driptray",
      ],
      number_of_heating_zones: 2,
      is_smart_controls: "yes",
      proposed_supplier_controls: "Smart Home Tech",
      heating_type: ["Radiators", "Underfloor heating"],
      quantity_of_radiators: 8,
      square_meters_underfloor_heating: 50,
      proposed_supplier_radiators: "Radiator World",
      ventilation_system_type: "CMEV, with Humidity inlets",
      number_of_wall_inlets: 4,
      extract_ventilation_rooms: ["Kitchen", "Main Bathroom", "En-suite 1"],
      ventilation_system_brand: "Vent Axia, Lindab",
      is_independent_validation: "yes",
      proposed_supplier_ventilation: "Ventilation Experts",
      cold_water_storage:
        "300 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)",
      proposed_supplier_water_tank: "Water Tank Solutions",
      appliances_requiring_water: ["Dishwasher", "Washing machine"],
      sanitary_ware: ["Supply & Fit"],
      sanitary_ware_brand: "Ideal Standard",
      number_of_toilets: 2,
      number_of_wash_hand_basins: 3,
      whb_taps: "Mono bloc tap",
      number_of_baths: 1,
      number_of_bath_screens: "yes",
      bath_taps: "Bath shower mixer",
      number_of_showers: 2,
      shower_mixer: "Concealed",
      shower_doors: "yes",
      standard_doc_m_wc_pack: "yes",
      is_doc_m_pack_shower: "yes",
      qty_additional_hand_rails: 3,
      qty_additional_drop_down_rails: 2,
      fire_safety_equipment: ["Fire Extinguisher", "Fire Blanket"],
      is_fire_proofing: "yes",
      is_grounds: "yes",
      landlord_services: ["Dry Riser", "Landlord Mains water services"],
    });
  };

  return (
    <main className="p-8 md:p-12 md:px-24  space-y-4">
      <h1 className="font-black text-3xl">House Price Calculator</h1>
      <button
        className="border px-4 py-2 rounded-md"
        onClick={() => fillDemoData()}
      >
        Fill demo
      </button>
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <form className="w-full md:w-[65%] space-y-5">
          <TextInput
            name="tender_number"
            label="Tender Number"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.tender_number}
          />
          <TextInput
            name="client_name"
            label="Client Name"
            placeholder="Enter name"
            onChange={handleInputChange}
            value={formData.client_name}
          />
          <TextInput
            name="client_representative"
            label="Who is the client representative"
            placeholder="Enter name"
            onChange={handleInputChange}
            value={formData.client_representative}
          />
          <TextInput
            name="phone_number"
            type="number"
            label="Phone Number"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.phone_number}
          />
          <TextInput
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            onChange={handleInputChange}
            value={formData.email}
          />
          <TextInput
            name="due_date"
            type="date"
            label="What is the due date?"
            onChange={handleInputChange}
            value={formData.due_date}
          />
          {/* <FileUpload 
            name="reference_documents" 
            label="Reference Documents, drawings, specification" 
            onChange={handleInputChange}
          /> */}
          <TextInput
            name="house_type"
            label="House Type"
            placeholder="Enter type"
            onChange={handleInputChange}
            value={formData.house_type}
          />
          <CustomTextInput
            name="number_of_bedrooms"
            type="number"
            label="Number of Bedrooms"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_bedrooms}
            custom_price_val={basePrices.bedroom}
            setBasePrices={setBasePrices}
            price_key="bedroom"
          />
          <CustomTextInput
            name="number_of_bathrooms"
            type="number"
            label="Number of Bathrooms"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_bathrooms}
            custom_price_val={basePrices.bathroom}
            setBasePrices={setBasePrices}
            price_key="bathroom"
          />

          <RadioInput
            name="is_utility_room"
            label="Is there a utility room?"
            options={["yes", "no"]}
            onChange={(value) => handleRadioChange("is_utility_room", value)}
            value={formData.is_utility_room}
          />
          <SelectInput
            name="heating_system_type"
            label="Heating system, Heat pump type"
            options={[
              {
                value: "exhaust_air_hot_water",
                label: "Exhaust Air Hot water only",
              },
              {
                value: "exhaust_air_heating",
                label: "Exhaust Air Heating & Hot water",
              },
              { value: "mono_bloc", label: "Mono Bloc" },
              { value: "split_type", label: "Split type" },
            ]}
            onChange={handleInputChange}
            value={formData.heating_system_type}
            placeholder="Select a heating system type"
          />
          <SelectInput
            name="heatpump_brand"
            label="Heatpump Brand"
            options={[
              "LG",
              "E-Ven",
              "Hitachi",
              "Panasonic",
              "Media",
              "Mitsubishi",
              "Daikin",
              "Samsung",
              "Joule",
              "Nilan",
              "Greentherm",
              "Dimplex",
            ].map((value) => ({ value, label: value }))}
            onChange={handleInputChange}
            value={formData.heatpump_brand}
            placeholder="Select a heatpump brand"
          />
          <SelectInput
            name="heatpump_size"
            label="Heatpump size"
            options={[3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16].map((value) => ({
              value,
              label: `${value} Kw`,
            }))}
            onChange={handleInputChange}
            value={formData.heatpump_size}
            placeholder="Select a heatpump size"
          />
          <SelectInput
            name="hot_water_cylinder_size"
            label="Hot water cylinder size"
            options={[150, 180, 200, 210, 250, 300].map((value) => ({
              value,
              label: `${value} L`,
            }))}
            onChange={handleInputChange}
            value={formData.hot_water_cylinder_size}
            placeholder="Select a hot water cylinder size"
          />
          <TextInput
            name="proposed_supplier_heatpump"
            label="Proposed Supplier"
            placeholder="Enter supplier"
            onChange={handleInputChange}
            value={formData.proposed_supplier_heatpump}
          />
          {/* <FileUpload 
            name="heatpump_quote" 
            label="Heatpump Quote used" 
            onChange={handleInputChange}
          /> */}

          <MultiCheckBoxSelect
            name="heatpump_requirements"
            label="Are any of the following required with the heat pump"
            type="checkbox"
            options={[
              "Fridge pipe & F-Gas Engineer (only if split type)",
              "32mm F& R to outside unit from hotpress (if mono bloc)",
              "Insulated ductwork to external facade (if Exhaust Air)",
              "Driptray",
              "Un-vented kit",
              "Feet",
            ]}
            onChange={(value) =>
              handleMultiSelectChange("heatpump_requirements", value)
            }
            value={formData.heatpump_requirements}
          />

          <CustomTextInput
            name="number_of_heating_zones"
            type="number"
            label="Number of heating zones"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_heating_zones}
            custom_price_val={basePrices.heatingZones}
            setBasePrices={setBasePrices}
            price_key="heatingZones"
          />
          <RadioInput
            name="is_smart_controls"
            label="Are Smart controls required"
            options={["yes", "no"]}
            onChange={(value) => handleRadioChange("is_smart_controls", value)}
            value={formData.is_smart_controls}
          />
          <TextInput
            name="proposed_supplier_controls"
            label="Proposed Supplier"
            placeholder="Enter supplier"
            onChange={handleInputChange}
            value={formData.proposed_supplier_controls}
          />
          {/* <FileUpload 
            name="controls_quote" 
            label="Controls Quote used" 
            onChange={handleInputChange}
          /> */}
          <MultiCheckBoxSelect
            name="heating_type"
            type="checkbox"
            label="Heating type"
            options={["Radiators", "Underfloor heating"]}
            onChange={(value) => handleMultiSelectChange("heating_type", value)}
            value={formData.heating_type}
          />
          {formData.heating_type.includes("Radiators") && (
            <TextInput
              name="quantity_of_radiators"
              type="number"
              label="Quantity of Radiators"
              placeholder="Enter number"
              onChange={handleInputChange}
              value={formData.quantity_of_radiators}
            />
          )}
          {formData.heating_type.includes("Underfloor heating") && (
            <TextInput
              name="square_meters_underfloor_heating"
              type="number"
              label="Square meters of underfloor heating"
              placeholder="Enter area"
              onChange={handleInputChange}
              value={formData.square_meters_underfloor_heating}
            />
          )}
          <TextInput
            name="proposed_supplier_radiators"
            label="Proposed Supplier"
            placeholder="Enter supplier"
            onChange={handleInputChange}
            value={formData.proposed_supplier_radiators}
          />
          {/* <FileUpload 
            name="radiator_quote" 
            label="Radiator or Underfloor quote used" 
            onChange={handleInputChange}
          /> */}

          {formData.is_utility_room == "yes" && (
            <>
              <SelectInput
                name="ventilation_system_type"
                label="Ventilation System Type"
                options={[
                  "CMEV, Continuous Mechanical Ventilation Non Humidity inlets",
                  "CMEV, with Humidity inlets",
                  "DCV, Demand control Ventilation",
                  "Heat Recovery Ventilation",
                ].map((value) => ({ value, label: value }))}
                onChange={handleInputChange}
                value={formData.ventilation_system_type}
                placeholder="Select ventilation system type"
              />
              <TextInput
                name="number_of_wall_inlets"
                type="number"
                label="Number of Wall inlets or supply grilles"
                placeholder="Enter number"
                onChange={handleInputChange}
                value={formData.number_of_wall_inlets}
              />
              <MultiCheckBoxSelect
                name="extract_ventilation_rooms"
                label="Rooms Requiring Extract Ventilation"
                type="checkbox"
                options={[
                  "Kitchen",
                  "Utility",
                  "Down Stairs WC",
                  "Main Bathroom",
                  "En-suite 1",
                  "En-suite 2",
                  "En-suite 3",
                  "En-suite 4",
                ]}
                onChange={(value) =>
                  handleMultiSelectChange("extract_ventilation_rooms", value)
                }
                value={formData.extract_ventilation_rooms}
              />
              <SelectInput
                name="ventilation_system_brand"
                label="Ventilation System Brand"
                options={[
                  "Aldes",
                  "Aereco",
                  "Vent Axia, Lindab",
                  "Unitherm",
                  "Zehnder, Versatile",
                ].map((value) => ({ value, label: value }))}
                onChange={handleInputChange}
                value={formData.ventilation_system_brand}
                placeholder="Select ventilation system brand"
              />
              <RadioInput
                name="is_independent_validation"
                label="Are we providing Independent validation"
                options={["yes", "no"]}
                onChange={(value) =>
                  handleRadioChange("is_independent_validation", value)
                }
                value={formData.is_independent_validation}
              />
              <TextInput
                name="proposed_supplier_ventilation"
                label="Proposed Supplier"
                placeholder="Enter supplier"
                onChange={handleInputChange}
                value={formData.proposed_supplier_ventilation}
              />
              {/* <FileUpload 
            name="ventilation_quote" 
            label="Ventilation Quote used" 
            onChange={handleInputChange}
          /> */}
            </>
          )}

          <SelectInput
            name="cold_water_storage"
            label="Cold Water Storage"
            options={[
              "Central Storage, No Tank in house / apartment",
              "230 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)",
              "300 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)",
              "500 Litre Aquabox type tank, (Storage tank c/w submersable booster pump)",
              "230 Litre coffin tank, c/w lid, insulation & separate cold water booster pump",
              "300 Litre coffin tank, c/w lid, insulation & separate cold water booster pump",
              "500 Litre coffin tank, c/w lid, insulation & separate cold water booster pump",
            ].map((value) => ({ value, label: value }))}
            onChange={handleInputChange}
            value={formData.cold_water_storage}
            placeholder="Select cold water storage"
          />
          <TextInput
            name="proposed_supplier_water_tank"
            label="Proposed Supplier"
            placeholder="Enter supplier"
            onChange={handleInputChange}
            value={formData.proposed_supplier_water_tank}
          />
          {/* <FileUpload 
            name="water_tank_quote" 
            label="Water tank Quote used" 
            onChange={handleInputChange}
          /> */}

          <MultiCheckBoxSelect
            name="appliances_requiring_water"
            label="Appliances requiring water & Waste"
            type="checkbox"
            options={["Dishwasher", "Washing machine", "Fridge"]}
            onChange={(value) =>
              handleMultiSelectChange("appliances_requiring_water", value)
            }
            value={formData.appliances_requiring_water}
          />
          <MultiCheckBoxSelect
            name="sanitary_ware"
            type="checkbox"
            label="Sanitary Ware"
            options={["Fit only", "Supply & Fit"]}
            onChange={(value) =>
              handleMultiSelectChange("sanitary_ware", value)
            }
            value={formData.sanitary_ware}
          />
          <SelectInput
            name="sanitary_ware_brand"
            label="Sanitary Ware Brand"
            options={["Sonas", "Ideal Standard", "Niko Bathrooms"].map(
              (value) => ({ value, label: value })
            )}
            onChange={handleInputChange}
            value={formData.sanitary_ware_brand}
            placeholder="Select sanitary ware brand"
          />
          <TextInput
            name="number_of_toilets"
            type="number"
            label="Number of Toilets"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_toilets}
          />
          <TextInput
            name="number_of_wash_hand_basins"
            type="number"
            label="Number of Wash hand basins"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_wash_hand_basins}
          />
          <SelectInput
            name="whb_taps"
            label="WHB Taps"
            options={[
              { value: "2 taps", label: "2 taps" },
              { value: "Mono bloc tap", label: "Mono bloc tap" },
              {
                value: "Thermostatic Mono bloc tap",
                label: "Thermostatic Mono bloc tap",
              },
            ]}
            onChange={handleInputChange}
            value={formData.whb_taps}
            placeholder="Select whb taps"
          />
          <TextInput
            name="number_of_baths"
            type="number"
            label="Number of Baths"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_baths}
          />
          <RadioInput
            name="number_of_bath_screens"
            label="Number of bath screens required"
            options={["yes", "no"]}
            onChange={(value) =>
              handleRadioChange("number_of_bath_screens", value)
            }
            value={formData.number_of_bath_screens}
          />
          <SelectInput
            name="bath_taps"
            label="Bath taps"
            options={[
              { value: "Bath taps", label: "Bath taps" },
              { value: "Bath shower mixer", label: "Bath shower mixer" },
            ]}
            onChange={handleInputChange}
            value={formData.bath_taps}
            placeholder="Select baths taps"
          />
          <TextInput
            name="number_of_showers"
            type="number"
            label="Number of Showers"
            placeholder="Enter number"
            onChange={handleInputChange}
            value={formData.number_of_showers}
          />
          <SelectInput
            name="shower_mixer"
            label="Shower mixer"
            options={[
              { value: "Tee Bar", label: "Tee Bar" },
              { value: "Concealed", label: "Concealed" },
            ]}
            onChange={handleInputChange}
            value={formData.shower_mixer}
            placeholder="Select shower mixer type"
          />
          <RadioInput
            name="shower_doors"
            label="Shower Doors"
            options={["yes", "no"]}
            onChange={(value) => handleRadioChange("shower_doors", value)}
            value={formData.shower_doors}
          />
          <RadioInput
            name="standard_doc_m_wc_pack"
            label="Standard Doc-M WC pack"
            options={["yes", "no"]}
            onChange={(value) =>
              handleRadioChange("standard_doc_m_wc_pack", value)
            }
            value={formData.standard_doc_m_wc_pack}
          />
          <RadioInput
            name="is_doc_m_pack_shower"
            label="Doc-m Pack c/w shower pack"
            options={["yes", "no"]}
            onChange={(value) =>
              handleRadioChange("is_doc_m_pack_shower", value)
            }
            value={formData.is_doc_m_pack_shower}
          />
          <TextInput
            name="qty_additional_hand_rails"
            type="number"
            label="Qty of Additional Hand rails"
            placeholder="Enter quantity"
            onChange={handleInputChange}
            value={formData.qty_additional_hand_rails}
          />
          <TextInput
            name="qty_additional_drop_down_rails"
            type="number"
            label="Qty of Additional Drop down rails"
            placeholder="Enter quantity"
            onChange={handleInputChange}
            value={formData.qty_additional_drop_down_rails}
          />

          {/* <FileUpload 
            name="sanitary_ware_quote" 
            label="Sanitary ware quote used" 
            onChange={handleInputChange}
          /> */}
          <MultiCheckBoxSelect
            name="fire_safety_equipment"
            label="Fire Extinguishers & Blankets"
            type="checkbox"
            options={["Fire Extinguisher", "Fire Blanket", "Excluded"]}
            onChange={(value) =>
              handleMultiSelectChange("fire_safety_equipment", value)
            }
            value={formData.fire_safety_equipment}
          />
          <RadioInput
            name="is_fire_proofing"
            label="Fire Proofing"
            options={["yes", "no"]}
            onChange={(value) => handleRadioChange("is_fire_proofing", value)}
            value={formData.is_fire_proofing}
          />
          <RadioInput
            name="is_grounds"
            label="Grounds"
            options={["yes", "no"]}
            onChange={(value) => handleRadioChange("is_grounds", value)}
            value={formData.is_grounds}
          />

          <MultiCheckBoxSelect
            name="landlord_services"
            type="checkbox"
            label="If Apartment Block what landlord services are required *"
            options={[
              "Dry Riser",
              "Landlord Mains water services",
              "Basement slung drainage (Soils & Wastes)",
              "Basement slung drainage (Rainwater disposal)",
              "Carpark ventilation / smoke control",
              "Stair lobby ventilation",
              "Bin store ventilation",
              "Stairwell pressurisation & smoke control",
              "Stairwell AOV's (Automatic opening vents)",
              "District Heating Plantroom",
              "District Heating Distribution",
            ]}
            onChange={(value) =>
              handleMultiSelectChange("landlord_services", value)
            }
            value={formData.landlord_services}
          />
          <button
            className="bg-blue-600 rounded-md text-white px-4 py-2 w-full font-semibold"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
        <div className="w-full space-y-4 md:w-[35%]">
          <div className="bg-sky-50 rounded-md p-4 space-y-2 ">
            <h2 className="font-black text-3xl mb-4">Price Breakdown</h2>

            {prices.length > 0 ? (
              <div className="space-y-3">
                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Property Basics
                  </h3>
                  {prices
                    .filter((item) =>
                      ["Bedrooms", "Bathrooms", "Utility Room"].includes(
                        item.name
                      )
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          €{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Heating System
                  </h3>
                  {prices
                    .filter((item) =>
                      [
                        "Heating System",
                        "Heatpump Brand",
                        "Heatpump Size",
                        "Water Cylinder",
                        "Heatpump Requirements",
                        "Heating Zones",
                        "Smart Controls",
                        "Radiators",
                      ].includes(item.name)
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          €{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Water & Sanitary
                  </h3>
                  {prices
                    .filter((item) =>
                      [
                        "Cold Water Storage",
                        "Water Appliances",
                        "Sanitary Ware",
                      ].includes(item.name)
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          €{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-700">
                    Additional Features
                  </h3>
                  {prices
                    .filter((item) =>
                      [
                        "Doc-M WC Pack",
                        "Doc-M Shower Pack",
                        "Hand Rails",
                        "Drop Down Rails",
                        "Fire Safety Equipment",
                        "Fire Proofing",
                        "Grounds Work",
                        "Landlord Services",
                      ].includes(item.name)
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          €{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Labor and Total */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  {prices
                    .filter((item) =>
                      ["Labor Costs", "Installation Fee"].includes(item.name)
                    )
                    .map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          €{item.cost.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Total */}
                {prices
                  .filter((item) => item.isTotal)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between pt-4 mt-4 border-t-2 border-gray-300"
                    >
                      <span className="font-bold text-lg">{item.name}</span>
                      <span className="font-bold text-lg">
                        €{item.cost.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Complete the form and submit to generate your quote
                </p>
              </div>
            )}
          </div>
          <button
            className="w-full  px-4 py-2 bg-blue-600 rounded-md text-white font-semibold"
            onClick={async () => {
              const res = await generatePdf(prices); // 👈 get correct key
              console.log(res);
              if (res.success) {
                window.open(res.url, "_blank");
              } else {
                alert(res.message);
              }
            }}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </main>
  );
}
