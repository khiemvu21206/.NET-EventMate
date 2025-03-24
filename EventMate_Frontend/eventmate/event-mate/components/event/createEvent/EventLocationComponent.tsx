"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface EventLocationProps {
  onPlaceChange: (place: string, details?: { ward: string; district: string; province: string }) => void;
}

interface Province {
  code: string;
  name: string;
  districts?: District[];
}

interface District {
  code: string;
  name: string;
  wards?: Ward[];
}

interface Ward {
  code: string;
  name: string;
}

export default function EventLocationComponent({ onPlaceChange }: EventLocationProps) {
  const [eventType, setEventType] = useState("offline");
  const [placeName, setPlaceName] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [error, setError] = useState<string>("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load danh sách tỉnh/thành
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError("Không thể tải danh sách tỉnh/thành. Vui lòng thử lại sau.");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Load danh sách quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
          setDistricts(response.data.districts || []);
          setError("");
        } catch (error) {
          console.error("Error fetching districts:", error);
          setError("Không thể tải danh sách quận/huyện. Vui lòng thử lại sau.");
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Load danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        setLoadingWards(true);
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`);
          setWards(response.data.wards || []);
          setError("");
        } catch (error) {
          console.error("Error fetching wards:", error);
          setError("Không thể tải danh sách phường/xã. Vui lòng thử lại sau.");
        } finally {
          setLoadingWards(false);
        }
      };

      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Xử lý khi thay đổi loại sự kiện
  const handleEventTypeChange = (type: string) => {
    setEventType(type);
    if (type === "online") {
      setPlaceName("");
      setHouseNumber("");
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
      setDistricts([]);
      setWards([]);
      onPlaceChange("");
    } else {
      setOnlineLink("");
      onPlaceChange("");
    }
  };

  // Xử lý khi thay đổi địa chỉ
  useEffect(() => {
    if (eventType === "offline") {
      console.log("=== Debug Địa Chỉ ===");
      console.log("Selected Province:", selectedProvince, "Type:", typeof selectedProvince);
      console.log("Selected District:", selectedDistrict, "Type:", typeof selectedDistrict);
      console.log("Selected Ward:", selectedWard, "Type:", typeof selectedWard);
      
      const addressParts = [];
      
      if (houseNumber) addressParts.push(houseNumber);
      if (placeName) addressParts.push(placeName);
      
      // Tìm ward
      const ward = wards.find(w => String(w.code) === String(selectedWard));
      console.log("Found Ward:", ward, "Ward Code Type:", typeof ward?.code);
      if (ward) addressParts.push(ward.name);
      
      // Tìm district
      const district = districts.find(d => String(d.code) === String(selectedDistrict));
      console.log("Found District:", district, "District Code Type:", typeof district?.code);
      if (district) addressParts.push(district.name);
      
      // Tìm province
      const province = provinces.find(p => String(p.code) === String(selectedProvince));
      console.log("Found Province:", province, "Province Code Type:", typeof province?.code);
      if (province) addressParts.push(province.name);

      console.log("Address Parts:", addressParts);
      const fullAddress = addressParts.join(", ");
      console.log("Full Address:", fullAddress);
      
      const addressDetails = {
        ward: ward?.name || "",
        district: district?.name || "",
        province: province?.name || ""
      };
      console.log("Address Details:", addressDetails);
      
      onPlaceChange(fullAddress, addressDetails);
    } else {
      onPlaceChange(onlineLink);
    }
  }, [eventType, placeName, houseNumber, selectedWard, selectedDistrict, selectedProvince, onlineLink, wards, districts, provinces]);

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <label className="block font-semibold mb-2">* Địa chỉ sự kiện</label>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {loadingProvinces && <p>Đang tải danh sách tỉnh/thành...</p>}
      {loadingDistricts && <p>Đang tải danh sách quận/huyện...</p>}
      {loadingWards && <p>Đang tải danh sách phường/xã...</p>}

      <div className="flex items-center space-x-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="eventType"
            value="offline"
            checked={eventType === "offline"}
            onChange={() => handleEventTypeChange("offline")}
            className="mr-2"
          />
          <span>Sự kiện Offline</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="eventType"
            value="online"
            checked={eventType === "online"}
            onChange={() => handleEventTypeChange("online")}
            className="mr-2"
          />
          <span>Sự kiện Online</span>
        </label>
      </div>

      {eventType === "offline" ? (
        <div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">* Tên địa điểm</label>
            <input
              type="text"
              maxLength={80}
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Tên địa điểm"
              className="w-full text-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Tỉnh/Thành</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                  setDistricts([]);
                  setWards([]);
                }}
                className="w-full text-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Quận/Huyện</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                  setWards([]);
                }}
                className="w-full text-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Phường/Xã</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full text-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">* Số nhà, đường</label>
              <input
                type="text"
                maxLength={80}
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Số nhà, đường"
                className="w-full text-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block font-semibold mb-1">* Link sự kiện online</label>
          <div className="relative">
            <input
              type="text"
              maxLength={200}
              value={onlineLink}
              onChange={(e) => setOnlineLink(e.target.value)}
              placeholder="Nhập link sự kiện online"
              className="w-full text-black border border-gray-700 rounded-md p-2 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-2 text-sm text-gray-400">
              {onlineLink.length} / 200
            </div>
          </div>
        </div>
      )}
    </div>
  );
}