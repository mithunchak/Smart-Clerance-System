from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import random
from datetime import datetime, timedelta
from dataclasses import dataclass
import math

app = FastAPI(title="Smart Clearance Pop-ups API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserProfile(BaseModel):
    user_id: str
    browsing_history: List[str] = []
    purchase_history: List[str] = []
    preferences: Dict[str, Any] = {}

class ClearanceItem(BaseModel):
    id: str
    name: str
    original_price: float
    current_price: float
    category: str
    stock_count: int
    days_until_removal: int
    urgency_score: float
    image_url: Optional[str] = None
    description: Optional[str] = None

class PopupRequest(BaseModel):
    user_profile: UserProfile
    current_page: str
    target_category: Optional[str] = None
    session_data: Dict[str, Any] = {}

class PopupResponse(BaseModel):
    show_popup: bool
    items: Optional[List[ClearanceItem]] = None
    discount_percentages: Optional[List[int]] = None
    urgency_messages: Optional[List[str]] = None
    sustainability_messages: Optional[List[str]] = None
    timer_seconds: int = 0

# Mock data - Expanded to 15+ items per category
CLEARANCE_ITEMS = [
    # Electronics (15+ items)
    ClearanceItem(
        id="e1",
        name="Bluetooth Wireless Headphones",
        original_price=89.99,
        current_price=45.99,
        category="electronics",
        stock_count=7,
        days_until_removal=5,
        urgency_score=0.7,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description="Premium wireless headphones with noise cancellation"
    ),
    ClearanceItem(
        id="e2",
        name="Wireless Phone Charger",
        original_price=39.99,
        current_price=19.99,
        category="electronics",
        stock_count=4,
        days_until_removal=4,
        urgency_score=0.75,
        image_url="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
        description="Fast wireless charging pad for smartphones"
    ),
    ClearanceItem(
        id="e3",
        name="Bluetooth Speaker",
        original_price=59.99,
        current_price=29.99,
        category="electronics",
        stock_count=3,
        days_until_removal=3,
        urgency_score=0.8,
        image_url="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        description="Portable Bluetooth speaker with 12-hour battery"
    ),
    ClearanceItem(
        id="e4",
        name="Smartphone Case",
        original_price=24.99,
        current_price=9.99,
        category="electronics",
        stock_count=12,
        days_until_removal=8,
        urgency_score=0.5,
        image_url="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
        description="Protective phone case with screen protector"
    ),
    ClearanceItem(
        id="e5",
        name="USB-C Hub",
        original_price=49.99,
        current_price=24.99,
        category="electronics",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.72,
        image_url="https://images.unsplash.com/photo-1591290619675-2c5b7c7e8c7d?w=400",
        description="Multi-port USB-C hub with HDMI and ethernet"
    ),
    ClearanceItem(
        id="e6",
        name="Wireless Earbuds",
        original_price=79.99,
        current_price=39.99,
        category="electronics",
        stock_count=5,
        days_until_removal=3,
        urgency_score=0.78,
        image_url="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
        description="True wireless earbuds with charging case"
    ),
    ClearanceItem(
        id="e7",
        name="Smart Watch",
        original_price=199.99,
        current_price=99.99,
        category="electronics",
        stock_count=2,
        days_until_removal=2,
        urgency_score=0.9,
        image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description="Fitness tracking smartwatch with heart rate monitor"
    ),
    ClearanceItem(
        id="e8",
        name="Portable Power Bank",
        original_price=34.99,
        current_price=17.99,
        category="electronics",
        stock_count=8,
        days_until_removal=6,
        urgency_score=0.65,
        image_url="https://images.unsplash.com/photo-1609592094137-3c3df4e4b451?w=400",
        description="10000mAh portable power bank with fast charging"
    ),
    ClearanceItem(
        id="e9",
        name="Gaming Mouse",
        original_price=69.99,
        current_price=34.99,
        category="electronics",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.82,
        image_url="https://images.unsplash.com/photo-1610647752706-3bb12232b3ab?w=400",
        description="RGB gaming mouse with programmable buttons"
    ),
    ClearanceItem(
        id="e10",
        name="Webcam HD",
        original_price=44.99,
        current_price=22.99,
        category="electronics",
        stock_count=7,
        days_until_removal=5,
        urgency_score=0.68,
        image_url="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
        description="1080p HD webcam with auto-focus"
    ),
    ClearanceItem(
        id="e11",
        name="Tablet Stand",
        original_price=29.99,
        current_price=14.99,
        category="electronics",
        stock_count=10,
        days_until_removal=7,
        urgency_score=0.55,
        image_url="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400",
        description="Adjustable tablet stand for desk use"
    ),
    ClearanceItem(
        id="e12",
        name="Car Phone Mount",
        original_price=19.99,
        current_price=9.99,
        category="electronics",
        stock_count=15,
        days_until_removal=9,
        urgency_score=0.45,
        image_url="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
        description="Magnetic car phone mount for dashboard"
    ),
    ClearanceItem(
        id="e13",
        name="Wireless Keyboard",
        original_price=54.99,
        current_price=27.99,
        category="electronics",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.73,
        image_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        description="Compact wireless keyboard with numeric keypad"
    ),
    ClearanceItem(
        id="e14",
        name="Phone Ring Holder",
        original_price=12.99,
        current_price=5.99,
        category="electronics",
        stock_count=20,
        days_until_removal=10,
        urgency_score=0.4,
        image_url="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400",
        description="360-degree rotating phone ring holder"
    ),
    ClearanceItem(
        id="e15",
        name="LED Strip Lights",
        original_price=39.99,
        current_price=19.99,
        category="electronics",
        stock_count=9,
        days_until_removal=6,
        urgency_score=0.62,
        image_url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        description="RGB LED strip lights with remote control"
    ),

    # Clothing (15+ items)
    ClearanceItem(
        id="c1",
        name="Organic Cotton T-Shirt",
        original_price=29.99,
        current_price=19.99,
        category="clothing",
        stock_count=3,
        days_until_removal=2,
        urgency_score=0.9,
        image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        description="Soft organic cotton t-shirt in classic fit"
    ),
    ClearanceItem(
        id="c2",
        name="Denim Jacket",
        original_price=59.99,
        current_price=29.99,
        category="clothing",
        stock_count=6,
        days_until_removal=6,
        urgency_score=0.65,
        image_url="https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
        description="Classic denim jacket with vintage wash"
    ),
    ClearanceItem(
        id="c3",
        name="Summer Dress",
        original_price=49.99,
        current_price=24.99,
        category="clothing",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.8,
        image_url="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        description="Floral summer dress with adjustable straps"
    ),
    ClearanceItem(
        id="c4",
        name="Casual Sneakers",
        original_price=79.99,
        current_price=39.99,
        category="clothing",
        stock_count=8,
        days_until_removal=5,
        urgency_score=0.7,
        image_url="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        description="Comfortable casual sneakers for everyday wear"
    ),
    ClearanceItem(
        id="c5",
        name="Winter Scarf",
        original_price=24.99,
        current_price=12.99,
        category="clothing",
        stock_count=12,
        days_until_removal=8,
        urgency_score=0.5,
        image_url="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400",
        description="Warm knitted scarf in multiple colors"
    ),
    ClearanceItem(
        id="c6",
        name="Baseball Cap",
        original_price=19.99,
        current_price=9.99,
        category="clothing",
        stock_count=15,
        days_until_removal=7,
        urgency_score=0.55,
        image_url="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
        description="Adjustable baseball cap with embroidered logo"
    ),
    ClearanceItem(
        id="c7",
        name="Hoodie Sweatshirt",
        original_price=44.99,
        current_price=22.99,
        category="clothing",
        stock_count=7,
        days_until_removal=4,
        urgency_score=0.75,
        image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        description="Cozy hoodie sweatshirt with front pocket"
    ),
    ClearanceItem(
        id="c8",
        name="Business Shirt",
        original_price=34.99,
        current_price=17.99,
        category="clothing",
        stock_count=5,
        days_until_removal=3,
        urgency_score=0.82,
        image_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        description="Professional button-down shirt for work"
    ),
    ClearanceItem(
        id="c9",
        name="Yoga Leggings",
        original_price=39.99,
        current_price=19.99,
        category="clothing",
        stock_count=9,
        days_until_removal=5,
        urgency_score=0.68,
        image_url="https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400",
        description="High-waisted yoga leggings with side pockets"
    ),
    ClearanceItem(
        id="c10",
        name="Leather Belt",
        original_price=29.99,
        current_price=14.99,
        category="clothing",
        stock_count=11,
        days_until_removal=6,
        urgency_score=0.6,
        image_url="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        description="Genuine leather belt with metal buckle"
    ),
    ClearanceItem(
        id="c11",
        name="Polo Shirt",
        original_price=32.99,
        current_price=16.99,
        category="clothing",
        stock_count=8,
        days_until_removal=4,
        urgency_score=0.72,
        image_url="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
        description="Classic polo shirt in multiple colors"
    ),
    ClearanceItem(
        id="c12",
        name="Athletic Shorts",
        original_price=26.99,
        current_price=13.99,
        category="clothing",
        stock_count=10,
        days_until_removal=7,
        urgency_score=0.58,
        image_url="https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400",
        description="Moisture-wicking athletic shorts with drawstring"
    ),
    ClearanceItem(
        id="c13",
        name="Flannel Shirt",
        original_price=36.99,
        current_price=18.99,
        category="clothing",
        stock_count=6,
        days_until_removal=3,
        urgency_score=0.78,
        image_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        description="Comfortable flannel shirt in plaid pattern"
    ),
    ClearanceItem(
        id="c14",
        name="Knit Beanie",
        original_price=16.99,
        current_price=8.99,
        category="clothing",
        stock_count=14,
        days_until_removal=8,
        urgency_score=0.52,
        image_url="https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400",
        description="Warm knit beanie in solid colors"
    ),
    ClearanceItem(
        id="c15",
        name="Cargo Pants",
        original_price=42.99,
        current_price=21.99,
        category="clothing",
        stock_count=5,
        days_until_removal=4,
        urgency_score=0.76,
        image_url="https://images.unsplash.com/photo-1506629905877-4d28e2acd4f3?w=400",
        description="Durable cargo pants with multiple pockets"
    ),

    # Home & Garden (15+ items)
    ClearanceItem(
        id="h1",
        name="Ceramic Coffee Mug Set",
        original_price=24.99,
        current_price=12.99,
        category="home",
        stock_count=2,
        days_until_removal=1,
        urgency_score=0.95,
        image_url="https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
        description="Handcrafted ceramic mugs, set of 4"
    ),
    ClearanceItem(
        id="h2",
        name="Decorative Plant Pot",
        original_price=18.99,
        current_price=9.99,
        category="home",
        stock_count=8,
        days_until_removal=7,
        urgency_score=0.6,
        image_url="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
        description="Ceramic plant pot with drainage holes"
    ),
    ClearanceItem(
        id="h3",
        name="Throw Pillow Set",
        original_price=34.99,
        current_price=17.99,
        category="home",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.75,
        image_url="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        description="Decorative throw pillows, set of 2"
    ),
    ClearanceItem(
        id="h4",
        name="Picture Frame Set",
        original_price=29.99,
        current_price=14.99,
        category="home",
        stock_count=10,
        days_until_removal=6,
        urgency_score=0.62,
        image_url="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400",
        description="Wooden picture frames, set of 3 different sizes"
    ),
    ClearanceItem(
        id="h5",
        name="Candle Set",
        original_price=22.99,
        current_price=11.99,
        category="home",
        stock_count=12,
        days_until_removal=8,
        urgency_score=0.5,
        image_url="https://images.unsplash.com/photo-1602874801006-36d8ac8bfb2e?w=400",
        description="Scented candles in glass jars, set of 3"
    ),
    ClearanceItem(
        id="h6",
        name="Kitchen Knife Set",
        original_price=79.99,
        current_price=39.99,
        category="home",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.83,
        image_url="https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400",
        description="Professional kitchen knife set with wooden block"
    ),
    ClearanceItem(
        id="h7",
        name="Bathroom Towel Set",
        original_price=49.99,
        current_price=24.99,
        category="home",
        stock_count=7,
        days_until_removal=5,
        urgency_score=0.7,
        image_url="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
        description="Soft cotton towel set with bath and hand towels"
    ),
    ClearanceItem(
        id="h8",
        name="Wall Clock",
        original_price=32.99,
        current_price=16.99,
        category="home",
        stock_count=9,
        days_until_removal=6,
        urgency_score=0.65,
        image_url="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400",
        description="Modern wall clock with silent movement"
    ),
    ClearanceItem(
        id="h9",
        name="Storage Baskets",
        original_price=39.99,
        current_price=19.99,
        category="home",
        stock_count=5,
        days_until_removal=4,
        urgency_score=0.78,
        image_url="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        description="Woven storage baskets, set of 2"
    ),
    ClearanceItem(
        id="h10",
        name="Table Lamp",
        original_price=44.99,
        current_price=22.99,
        category="home",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.73,
        image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description="Modern table lamp with fabric shade"
    ),
    ClearanceItem(
        id="h11",
        name="Cutting Board Set",
        original_price=26.99,
        current_price=13.99,
        category="home",
        stock_count=11,
        days_until_removal=7,
        urgency_score=0.58,
        image_url="https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400",
        description="Bamboo cutting boards, set of 3 sizes"
    ),
    ClearanceItem(
        id="h12",
        name="Shower Curtain",
        original_price=19.99,
        current_price=9.99,
        category="home",
        stock_count=13,
        days_until_removal=8,
        urgency_score=0.55,
        image_url="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
        description="Waterproof shower curtain with hooks"
    ),
    ClearanceItem(
        id="h13",
        name="Bookshelf",
        original_price=89.99,
        current_price=44.99,
        category="home",
        stock_count=3,
        days_until_removal=2,
        urgency_score=0.88,
        image_url="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        description="5-tier wooden bookshelf for home office"
    ),
    ClearanceItem(
        id="h14",
        name="Area Rug",
        original_price=69.99,
        current_price=34.99,
        category="home",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.82,
        image_url="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        description="Modern geometric area rug for living room"
    ),
    ClearanceItem(
        id="h15",
        name="Spice Rack",
        original_price=31.99,
        current_price=15.99,
        category="home",
        stock_count=8,
        days_until_removal=5,
        urgency_score=0.68,
        image_url="https://images.unsplash.com/photo-1594736797933-d0408cbf7a6c?w=400",
        description="Rotating spice rack with 16 jars"
    ),

    # Fitness (15+ items)
    ClearanceItem(
        id="f1",
        name="Yoga Mat Premium",
        original_price=49.99,
        current_price=24.99,
        category="fitness",
        stock_count=5,
        days_until_removal=3,
        urgency_score=0.8,
        image_url="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400",
        description="Non-slip premium yoga mat with carrying strap"
    ),
    ClearanceItem(
        id="f2",
        name="Resistance Bands Set",
        original_price=25.99,
        current_price=14.99,
        category="fitness",
        stock_count=3,
        days_until_removal=2,
        urgency_score=0.85,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Complete resistance bands set for home workouts"
    ),
    ClearanceItem(
        id="f3",
        name="Dumbbells Set",
        original_price=79.99,
        current_price=39.99,
        category="fitness",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.75,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Adjustable dumbbells set, 5-25 lbs each"
    ),
    ClearanceItem(
        id="f4",
        name="Foam Roller",
        original_price=34.99,
        current_price=17.99,
        category="fitness",
        stock_count=8,
        days_until_removal=5,
        urgency_score=0.7,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="High-density foam roller for muscle recovery"
    ),
    ClearanceItem(
        id="f5",
        name="Water Bottle",
        original_price=19.99,
        current_price=9.99,
        category="fitness",
        stock_count=15,
        days_until_removal=8,
        urgency_score=0.5,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Insulated stainless steel water bottle"
    ),
    ClearanceItem(
        id="f6",
        name="Jump Rope",
        original_price=16.99,
        current_price=8.99,
        category="fitness",
        stock_count=12,
        days_until_removal=7,
        urgency_score=0.55,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Adjustable jump rope with comfortable handles"
    ),
    ClearanceItem(
        id="f7",
        name="Kettlebell",
        original_price=44.99,
        current_price=22.99,
        category="fitness",
        stock_count=7,
        days_until_removal=4,
        urgency_score=0.72,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Cast iron kettlebell, 20 lbs"
    ),
    ClearanceItem(
        id="f8",
        name="Exercise Ball",
        original_price=29.99,
        current_price=14.99,
        category="fitness",
        stock_count=9,
        days_until_removal=6,
        urgency_score=0.65,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Anti-burst exercise ball with pump"
    ),
    ClearanceItem(
        id="f9",
        name="Fitness Tracker",
        original_price=89.99,
        current_price=44.99,
        category="fitness",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.83,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Waterproof fitness tracker with heart rate monitor"
    ),
    ClearanceItem(
        id="f10",
        name="Yoga Blocks",
        original_price=22.99,
        current_price=11.99,
        category="fitness",
        stock_count=10,
        days_until_removal=6,
        urgency_score=0.6,
        image_url="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400",
        description="High-density foam yoga blocks, set of 2"
    ),
    ClearanceItem(
        id="f11",
        name="Gym Bag",
        original_price=39.99,
        current_price=19.99,
        category="fitness",
        stock_count=11,
        days_until_removal=7,
        urgency_score=0.58,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Durable gym bag with multiple compartments"
    ),
    ClearanceItem(
        id="f12",
        name="Resistance Loop Bands",
        original_price=18.99,
        current_price=9.99,
        category="fitness",
        stock_count=13,
        days_until_removal=8,
        urgency_score=0.52,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Mini resistance loop bands, set of 5"
    ),
    ClearanceItem(
        id="f13",
        name="Workout Gloves",
        original_price=24.99,
        current_price=12.99,
        category="fitness",
        stock_count=8,
        days_until_removal=5,
        urgency_score=0.68,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Padded workout gloves with wrist support"
    ),
    ClearanceItem(
        id="f14",
        name="Balance Board",
        original_price=32.99,
        current_price=16.99,
        category="fitness",
        stock_count=6,
        days_until_removal=4,
        urgency_score=0.75,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Wooden balance board for core training"
    ),
    ClearanceItem(
        id="f15",
        name="Massage Ball",
        original_price=14.99,
        current_price=7.99,
        category="fitness",
        stock_count=14,
        days_until_removal=9,
        urgency_score=0.48,
        image_url="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        description="Textured massage ball for trigger point therapy"
    ),

    # Office (15+ items)
    ClearanceItem(
        id="o1",
        name="LED Desk Lamp",
        original_price=34.99,
        current_price=17.99,
        category="office",
        stock_count=1,
        days_until_removal=1,
        urgency_score=0.98,
        image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        description="Adjustable LED desk lamp with USB charging port"
    ),
    ClearanceItem(
        id="o2",
        name="Wireless Mouse",
        original_price=22.99,
        current_price=12.99,
        category="office",
        stock_count=5,
        days_until_removal=5,
        urgency_score=0.7,
        image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        description="Ergonomic wireless mouse with long battery life"
    ),
    ClearanceItem(
        id="o3",
        name="Desk Organizer",
        original_price=26.99,
        current_price=13.99,
        category="office",
        stock_count=7,
        days_until_removal=4,
        urgency_score=0.72,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Bamboo desk organizer with multiple compartments"
    ),
    ClearanceItem(
        id="o4",
        name="Office Chair Cushion",
        original_price=39.99,
        current_price=19.99,
        category="office",
        stock_count=9,
        days_until_removal=6,
        urgency_score=0.65,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Memory foam office chair cushion for comfort"
    ),
    ClearanceItem(
        id="o5",
        name="Notebook Set",
        original_price=18.99,
        current_price=9.99,
        category="office",
        stock_count=12,
        days_until_removal=7,
        urgency_score=0.58,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Lined notebooks with hardcover, set of 3"
    ),
    ClearanceItem(
        id="o6",
        name="Stapler",
        original_price=15.99,
        current_price=7.99,
        category="office",
        stock_count=15,
        days_until_removal=8,
        urgency_score=0.5,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Heavy-duty stapler with staple remover"
    ),
    ClearanceItem(
        id="o7",
        name="Monitor Stand",
        original_price=49.99,
        current_price=24.99,
        category="office",
        stock_count=6,
        days_until_removal=3,
        urgency_score=0.78,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Adjustable monitor stand with storage drawer"
    ),
    ClearanceItem(
        id="o8",
        name="Pen Set",
        original_price=24.99,
        current_price=12.99,
        category="office",
        stock_count=10,
        days_until_removal=6,
        urgency_score=0.62,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Professional pen set with case"
    ),
    ClearanceItem(
        id="o9",
        name="File Folders",
        original_price=12.99,
        current_price=6.99,
        category="office",
        stock_count=18,
        days_until_removal=9,
        urgency_score=0.45,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Manila file folders, pack of 25"
    ),
    ClearanceItem(
        id="o10",
        name="Desk Calendar",
        original_price=19.99,
        current_price=9.99,
        category="office",
        stock_count=11,
        days_until_removal=7,
        urgency_score=0.55,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="2024 desk calendar with monthly pages"
    ),
    ClearanceItem(
        id="o11",
        name="Paper Shredder",
        original_price=79.99,
        current_price=39.99,
        category="office",
        stock_count=4,
        days_until_removal=3,
        urgency_score=0.83,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Cross-cut paper shredder for home office"
    ),
    ClearanceItem(
        id="o12",
        name="Whiteboard",
        original_price=32.99,
        current_price=16.99,
        category="office",
        stock_count=8,
        days_until_removal=5,
        urgency_score=0.68,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Magnetic whiteboard with markers and eraser"
    ),
    ClearanceItem(
        id="o13",
        name="Desk Pad",
        original_price=22.99,
        current_price=11.99,
        category="office",
        stock_count=13,
        days_until_removal=8,
        urgency_score=0.52,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Large desk pad with non-slip base"
    ),
    ClearanceItem(
        id="o14",
        name="Label Maker",
        original_price=44.99,
        current_price=22.99,
        category="office",
        stock_count=5,
        days_until_removal=4,
        urgency_score=0.76,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Portable label maker with various tape colors"
    ),
    ClearanceItem(
        id="o15",
        name="Bookends",
        original_price=16.99,
        current_price=8.99,
        category="office",
        stock_count=14,
        days_until_removal=8,
        urgency_score=0.48,
        image_url="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
        description="Metal bookends with non-slip base, set of 2"
    )
]

class ClearanceEngine:
    def __init__(self):
        # Track recently shown items to avoid repetition
        self.recently_shown_items = set()
        self.max_recent_items = 5  # Keep track of last 5 shown items
    
    def calculate_urgency_score(self, item: ClearanceItem) -> float:
        """Calculate urgency score based on stock and days until removal"""
        stock_factor = max(0, (10 - item.stock_count) / 10)
        time_factor = max(0, (7 - item.days_until_removal) / 7)
        return min(1.0, (stock_factor * 0.6) + (time_factor * 0.4))
    
    def calculate_dynamic_discount(self, item: ClearanceItem, user_profile: UserProfile) -> int:
        """Calculate dynamic discount based on urgency and user behavior"""
        base_discount = ((item.original_price - item.current_price) / item.original_price) * 100
        
        # Additional discount based on urgency
        urgency_bonus = item.urgency_score * 15  # Up to 15% additional
        
        # User behavior bonus
        category_interest = 1.0
        if item.category in user_profile.browsing_history:
            category_interest = 1.2
        if item.category in user_profile.purchase_history:
            category_interest = 1.5
            
        total_discount = min(70, base_discount + (urgency_bonus * category_interest))
        return int(total_discount)
    
    def should_show_popup(self, user_profile: UserProfile, current_page: str) -> bool:
        """Determine if popup should be shown based on user context"""
        # Don't show on checkout or cart pages
        if current_page in ["checkout", "cart", "payment"]:
            return False
            
        # Show probability based on browsing behavior (increased likelihood)
        browsing_score = len(user_profile.browsing_history) * 0.1
        return random.random() < min(0.9, 0.7 + browsing_score)  # Much higher chance to show popup
    
    def select_best_items(self, user_profile: UserProfile, count: int = 1, target_category: Optional[str] = None, shown_popups: List[str] = None) -> List[ClearanceItem]:
        """Select the best clearance items for the user with variety"""
        scored_items = []
        
        # Filter items by target category if specified
        items_to_consider = CLEARANCE_ITEMS
        if target_category:
            items_to_consider = [item for item in CLEARANCE_ITEMS if item.category == target_category]
            print(f"Filtering items for category '{target_category}': found {len(items_to_consider)} items")
        
        # Filter to only include TRUE clearance items (high urgency and significant discount)
        true_clearance_items = []
        for item in items_to_consider:
            discount_percentage = ((item.original_price - item.current_price) / item.original_price) * 100
            # Only include items with high urgency score (>= 0.7) OR significant discount (>= 40%)
            if item.urgency_score >= 0.7 or discount_percentage >= 40:
                true_clearance_items.append(item)
        
        items_to_consider = true_clearance_items
        print(f"After filtering for true clearance items: {len(items_to_consider)} items remain")
        
        # Remove already shown items from this session
        if shown_popups:
            items_to_consider = [item for item in items_to_consider if item.id not in shown_popups]
            print(f"After removing shown items: {len(items_to_consider)} items remain")
        
        # If no items left, reset and allow repeats from true clearance items
        if not items_to_consider:
            items_to_consider = true_clearance_items
            print(f"No new items available, allowing repeats from true clearance items: {len(items_to_consider)} items")
        
        for item in items_to_consider:
            score = item.urgency_score
            
            # Boost score for user's interests
            if item.category in user_profile.browsing_history:
                score += 0.2
            if item.category in user_profile.purchase_history:
                score += 0.3
                
            # Penalize recently shown items (different from session shown items)
            if item.id in self.recently_shown_items:
                score -= 0.3
                
            # Add randomization to ensure variety (0.1 to 0.5 random boost)
            random_boost = random.uniform(0.1, 0.5)
            score += random_boost
                
            scored_items.append((score, item))
        
        # Sort by score and return the best items
        scored_items.sort(key=lambda x: x[0], reverse=True)
        
        # For category-specific requests, just take the top items
        if target_category and scored_items:
            selected_items = [item for _, item in scored_items[:count]]
        else:
            # Ensure we don't show the same items repeatedly by adding category diversity
            selected_items = []
            used_categories = set()
            
            # First pass: select items from different categories
            for score, item in scored_items:
                if item.category not in used_categories and len(selected_items) < count:
                    selected_items.append(item)
                    used_categories.add(item.category)
            
            # Second pass: fill remaining slots if needed
            if len(selected_items) < count:
                for score, item in scored_items:
                    if item not in selected_items and len(selected_items) < count:
                        selected_items.append(item)
        
        # Don't shuffle if we want to maintain score order
        # random.shuffle(selected_items)
        
        # Track these items as recently shown
        for item in selected_items:
            self.recently_shown_items.add(item.id)
        
        # Keep only the most recent items in the tracking set
        if len(self.recently_shown_items) > self.max_recent_items:
            # Remove oldest items (this is a simplified approach)
            items_to_remove = list(self.recently_shown_items)[:len(self.recently_shown_items) - self.max_recent_items]
            for item_id in items_to_remove:
                self.recently_shown_items.discard(item_id)
        
        return selected_items[:count]
    
    def generate_urgency_message(self, item: ClearanceItem) -> str:
        """Generate urgency message based on item properties"""
        if item.stock_count <= 2:
            return f"Only {item.stock_count} left in stock!"
        elif item.days_until_removal <= 2:
            return f"Clearance ends in {item.days_until_removal} day{'s' if item.days_until_removal > 1 else ''}!"
        else:
            return "Limited time clearance deal!"
    
    def generate_sustainability_message(self, item: ClearanceItem) -> str:
        """Generate sustainability message"""
        messages = [
            "Help reduce waste by giving this item a new home 🌱",
            "Save money and the planet with this clearance find 🌍",
            "Prevent landfill waste - buy clearance, help Earth 🌿",
            "Sustainable shopping: rescue this item from disposal ♻️"
        ]
        return random.choice(messages)

# Initialize the engine
engine = ClearanceEngine()

@app.get("/")
async def root():
    return {"message": "Smart Clearance Pop-ups API", "status": "running"}

@app.post("/api/popup", response_model=PopupResponse)
async def get_popup_recommendation(request: PopupRequest):
    """Get personalized popup recommendation"""
    try:
        print(f"Popup request received for user: {request.user_profile.user_id}")
        print(f"User browsing history: {request.user_profile.browsing_history}")
        print(f"Target category: {request.target_category}")
        
        # Check if popup should be shown
        if not engine.should_show_popup(request.user_profile, request.current_page):
            print("Popup not shown - engine decided against it")
            return PopupResponse(show_popup=False)
        
        # Select best items for user (only 1 item)
        item_count = 1
        shown_popups = request.session_data.get('shown_popups', [])
        print(f"Session shown popups: {shown_popups}")
        best_items = engine.select_best_items(request.user_profile, item_count, request.target_category, shown_popups)
        
        print(f"Selected {len(best_items)} items for popup:")
        for item in best_items:
            discount_pct = ((item.original_price - item.current_price) / item.original_price) * 100
            print(f"  - {item.name} (Category: {item.category}, Urgency: {item.urgency_score:.2f}, Discount: {discount_pct:.1f}%)")
        
        # If no clearance items available, don't show popup
        if not best_items:
            print("No clearance items available - not showing popup")
            return PopupResponse(show_popup=False)
        
        # Calculate dynamic discounts for each item
        discounts = []
        urgency_messages = []
        sustainability_messages = []
        
        for item in best_items:
            discount = engine.calculate_dynamic_discount(item, request.user_profile)
            discounts.append(discount)
            
            urgency_msg = engine.generate_urgency_message(item)
            urgency_messages.append(urgency_msg)
            
            sustainability_msg = engine.generate_sustainability_message(item)
            sustainability_messages.append(sustainability_msg)
        
        # Calculate timer (30-180 seconds based on average urgency)
        avg_urgency = sum(item.urgency_score for item in best_items) / len(best_items)
        timer = int(30 + (150 * (1 - avg_urgency)))
        
        response = PopupResponse(
            show_popup=True,
            items=best_items,
            discount_percentages=discounts,
            urgency_messages=urgency_messages,
            sustainability_messages=sustainability_messages,
            timer_seconds=timer
        )
        
        print(f"Popup response created with {len(best_items)} items")
        return response
        
    except Exception as e:
        print(f"Error in popup recommendation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clearance-items", response_model=List[ClearanceItem])
async def get_clearance_items():
    """Get all clearance items"""
    return CLEARANCE_ITEMS

@app.get("/api/clearance-items/{item_id}", response_model=ClearanceItem)
async def get_clearance_item(item_id: str):
    """Get specific clearance item"""
    item = next((item for item in CLEARANCE_ITEMS if item.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/track-interaction")
async def track_interaction(data: Dict[str, Any]):
    """Track user interactions with popups"""
    # In a real implementation, this would save to a database
    print(f"Interaction tracked: {data}")
    return {"status": "success", "message": "Interaction tracked"}

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    """Get analytics summary for the dashboard"""
    # Mock analytics data
    return {
        "total_popups_shown": 1247,
        "conversion_rate": 0.23,
        "average_discount": 35,
        "items_saved_from_waste": 89,
        "revenue_generated": 15678.45,
        "top_categories": [
            {"category": "electronics", "conversions": 45},
            {"category": "clothing", "conversions": 38},
            {"category": "home", "conversions": 29}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
