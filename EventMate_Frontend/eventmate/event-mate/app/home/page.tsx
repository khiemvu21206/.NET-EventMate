"use client";

import React, { useEffect, useState } from "react";
import CarouselComponent from '@/components/home/CarouselComponent';
import SpecialEventComponent from '@/components/home/SpecialEventComponent';
import TopEventComponent from '@/components/home/TopEventComponent';
import TimeComponent from '@/components/home/TimeComponent';
import AdvertisementComponent from '@/components/home/AdvertisementComponent';
import TypeEventComponent from "@/components/home/TypeEventComponent";
import InterestingDestinationComponent from "@/components/home/InterestingDestinationComponent";
import { EventRepository1 } from "@/repositories/EventRepository";
import { RequestList } from "@/model/common";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <CarouselComponent />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Special Events Section */}
        <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <SpecialEventComponent />
        </section>

        {/* Top Events Section */}
        <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <TopEventComponent />
        </section>

        {/* Time Component Section */}
        <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <TimeComponent />
        </section>

        {/* Advertisement Section */}
        <section className="rounded-2xl overflow-hidden">
          <AdvertisementComponent />
        </section>

        {/* Event Types Sections */}
        <section className="space-y-16">
          {/* Music Events */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <TypeEventComponent title='Music' />
          </div>

          {/* Concert Events */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <TypeEventComponent title='Concert' />
          </div>

          {/* Other Events */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <TypeEventComponent title='Other' />
          </div>
        </section>

        {/* Interesting Destinations Section */}
        <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
          <InterestingDestinationComponent />
        </section>
      </div>
    </div>
  );
};

export default Home;