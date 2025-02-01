import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Header } from "../Header/Header";
import { Footer } from "../foo/Footer";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

export const Create = () => {
  const flatsCollection = collection(db, "Flats");
  const toast = useRef(null);
  
  const [formData, setFormData] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAC: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: null
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.streetName?.trim()) {
      newErrors.streetName = "Street name is required";
    }

    if (!formData.streetNumber || Number(formData.streetNumber) <= 0) {
      newErrors.streetNumber = "Valid street number is required";
    }

    if (!formData.areaSize || Number(formData.areaSize) <= 0) {
      newErrors.areaSize = "Valid area size is required";
    }

    if (!formData.yearBuilt) {
      newErrors.yearBuilt = "Year built is required";
    } else if (Number(formData.yearBuilt) < 1800 || Number(formData.yearBuilt) > currentYear) {
      newErrors.yearBuilt = `Year must be between 1800 and ${currentYear}`;
    }

    if (!formData.rentPrice || Number(formData.rentPrice) <= 0) {
      newErrors.rentPrice = "Valid rent price is required";
    }

    if (!formData.dateAvailable) {
      newErrors.dateAvailable = "Available date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForFirestore = (date) => {
    if (!date) return null;
    try {
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        throw new Error('Invalid date');
      }
      return validDate.toISOString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Format data for Firestore
        const propertyData = {
          ...formData,
          dateAvailable: formatDateForFirestore(formData.dateAvailable),
          streetNumber: Number(formData.streetNumber),
          areaSize: Number(formData.areaSize),
          yearBuilt: Number(formData.yearBuilt),
          rentPrice: Number(formData.rentPrice),
          hasAC: Boolean(formData.hasAC),
          createdAt: new Date().toISOString()
        };

        await addDoc(flatsCollection, propertyData);
        
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Property created successfully",
        });

        // Reset form after successful submission
        setFormData({
          city: "",
          streetName: "",
          streetNumber: "",
          areaSize: "",
          hasAC: false,
          yearBuilt: "",
          rentPrice: "",
          dateAvailable: null
        });
      } catch (error) {
        console.error("Error creating property:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to create property. Please try again.",
        });
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "hasAC" ? value : (id === "streetNumber" || id === "areaSize" || id === "yearBuilt" || id === "rentPrice") ? Number(value) : value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex-col items-center">
        <Header />
        <Card className="w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Property Details
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-gray-700 font-medium">
                City
              </label>
              <InputText
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={`p-inputtext-sm ${errors.city ? "p-invalid" : ""}`}
              />
              {errors.city && (
                <small className="text-red-500">{errors.city}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="streetName" className="text-gray-700 font-medium">
                Street Name
              </label>
              <InputText
                id="streetName"
                value={formData.streetName}
                onChange={handleChange}
                placeholder="Enter street name"
                className={`p-inputtext-sm ${errors.streetName ? "p-invalid" : ""}`}
              />
              {errors.streetName && (
                <small className="text-red-500">{errors.streetName}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="streetNumber" className="text-gray-700 font-medium">
                Street Number
              </label>
              <InputNumber
                id="streetNumber"
                value={formData.streetNumber}
                onValueChange={(e) => handleChange({
                  target: { id: "streetNumber", value: e.value }
                })}
                placeholder="Enter street number"
                className={`p-inputtext-sm ${errors.streetNumber ? "p-invalid" : ""}`}
              />
              {errors.streetNumber && (
                <small className="text-red-500">{errors.streetNumber}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="areaSize" className="text-gray-700 font-medium">
                Area Size (m²)
              </label>
              <InputNumber
                id="areaSize"
                value={formData.areaSize}
                onValueChange={(e) => handleChange({
                  target: { id: "areaSize", value: e.value }
                })}
                placeholder="Enter area size"
                suffix=" m²"
                className={`p-inputtext-sm ${errors.areaSize ? "p-invalid" : ""}`}
              />
              {errors.areaSize && (
                <small className="text-red-500">{errors.areaSize}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="hasAC" className="text-gray-700 font-medium">
                Has AC
              </label>
              <Checkbox
                id="hasAC"
                checked={formData.hasAC}
                onChange={(e) => handleChange({
                  target: { id: "hasAC", value: e.checked }
                })}
                className={errors.hasAC ? "p-invalid" : ""}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="yearBuilt" className="text-gray-700 font-medium">
                Year Built
              </label>
              <InputNumber
                id="yearBuilt"
                value={formData.yearBuilt}
                onValueChange={(e) => handleChange({
                  target: { id: "yearBuilt", value: e.value }
                })}
                placeholder="Enter year built"
                useGrouping={false}
                className={`p-inputtext-sm ${errors.yearBuilt ? "p-invalid" : ""}`}
              />
              {errors.yearBuilt && (
                <small className="text-red-500">{errors.yearBuilt}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rentPrice" className="text-gray-700 font-medium">
                Rent Price
              </label>
              <InputNumber
                id="rentPrice"
                value={formData.rentPrice}
                onValueChange={(e) => handleChange({
                  target: { id: "rentPrice", value: e.value }
                })}
                mode="currency"
                currency="USD"
                locale="en-US"
                className={`p-inputtext-sm ${errors.rentPrice ? "p-invalid" : ""}`}
              />
              {errors.rentPrice && (
                <small className="text-red-500">{errors.rentPrice}</small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dateAvailable" className="text-gray-700 font-medium">
                Date Available
              </label>
              <Calendar
                id="dateAvailable"
                value={formData.dateAvailable}
                onChange={(e) => handleChange({
                  target: { id: "dateAvailable", value: e.value }
                })}
                dateFormat="dd/mm/yy"
                showIcon
                minDate={new Date()}
                className={errors.dateAvailable ? "p-invalid" : ""}
              />
              {errors.dateAvailable && (
                <small className="text-red-500">{errors.dateAvailable}</small>
              )}
            </div>

            <Button
              type="submit"
              label="Create Property"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            />
          </form>
        </Card>
      </div>
    </>
  );
};