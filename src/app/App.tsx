import { useState } from "react"
import {
  ShoppingCart, Bell, ChevronLeft, X, Check, Clock,
  BarChart3, BookOpen, Receipt, Settings, LogOut,
  UtensilsCrossed, FileText, TrendingUp, TrendingDown,
  Search, Plus, Minus, QrCode, Filter, Download, Eye,
  Edit, Trash2, Wifi, Battery, Signal, LayoutDashboard,
  UserCheck, MapPin, Phone, Mail, Grid, Users,
} from "lucide-react"

// ─── TOKENS ───────────────────────────────────────────────
const C = {
  orange: "#F97316", // Rich Orange
  yellow: "#EAB308", // Golden Yellow
  green:  "#22C55E", // Vibrant Green
  blue:   "#3B82F6", // Modern Blue
  s0:     "#09090B", // Deepest background (zinc-950)
  s1:     "#18181B", // Slightly lighter (zinc-900)
  s2:     "#27272A", // Card background (zinc-800)
  s3:     "#3F3F46", // Highlight background (zinc-700)
  border: "#3F3F46", // Softer borders
  muted:  "#A1A1AA", // Softer text
  text:   "#FAFAFA", // Off-white text
}
const MONO = "'Space Mono', monospace"
const SANS = "'Space Grotesk', sans-serif"

// ─── TYPES ────────────────────────────────────────────────
type AppView = "selector" | "customer" | "waiter" | "admin" | "web"
type CustomerScreen = "qr" | "menu" | "cart" | "confirmed" | "bill"
type WaiterScreen   = "login" | "floor" | "table" | "notifications"
type AdminScreen    = "login" | "overview" | "menu" | "analytics" | "orders" | "profit" | "billing" | "staff" | "settings"
type WebScreen      = "home" | "menu" | "about" | "contact"

// ─── MOCK DATA ────────────────────────────────────────────
const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"]
const ITEMS = [
  { id:1, name:"Paneer Tikka",    desc:"Grilled cottage cheese, tandoor spices",    price:280, cat:"Starters", veg:true,  score:"star",        discount:0  },
  { id:2, name:"Chicken Wings",   desc:"Crispy wings, hot sriracha glaze",          price:320, cat:"Starters", veg:false, score:"puzzle",      discount:0  },
  { id:3, name:"Butter Chicken",  desc:"Slow-cooked tomato cream gravy",            price:380, cat:"Mains",    veg:false, score:"star",        discount:15 },
  { id:4, name:"Dal Makhani",     desc:"Black lentils, overnight slow-cook",        price:260, cat:"Mains",    veg:true,  score:"sleeper",     discount:0  },
  { id:5, name:"Gulab Jamun",     desc:"Milk dumplings, rose sugar syrup",          price:120, cat:"Desserts", veg:true,  score:"dead_weight", discount:0  },
  { id:6, name:"Masala Chai",     desc:"Indian spiced tea, full-cream milk",        price:60,  cat:"Drinks",   veg:true,  score:"star",        discount:0  },
  { id:7, name:"Cold Coffee",     desc:"Chilled espresso, vanilla ice cream",       price:140, cat:"Drinks",   veg:true,  score:"sleeper",     discount:0  },
]
const TABLES = [
  { id:1, num:"01", status:"bill",     total:1240, time:"48 min" },
  { id:2, num:"02", status:"occupied", total:680,  time:"22 min" },
  { id:3, num:"03", status:"free",     total:0,    time:"" },
  { id:4, num:"04", status:"occupied", total:1840, time:"35 min" },
  { id:5, num:"05", status:"free",     total:0,    time:"" },
  { id:6, num:"06", status:"bill",     total:960,  time:"61 min" },
  { id:7, num:"07", status:"occupied", total:420,  time:"12 min" },
  { id:8, num:"08", status:"free",     total:0,    time:"" },
  { id:9, num:"09", status:"occupied", total:760,  time:"28 min" },
]
const ORDERS = [
  { id:"ORD-0847", table:"04", items:5, total:1840, time:"2 min ago",  payment:"UPI",  status:"received" },
  { id:"ORD-0846", table:"07", items:2, total:420,  time:"4 min ago",  payment:"Cash", status:"served"   },
  { id:"ORD-0845", table:"02", items:3, total:680,  time:"8 min ago",  payment:"Card", status:"received" },
  { id:"ORD-0844", table:"09", items:4, total:760,  time:"15 min ago", payment:"UPI",  status:"served"   },
  { id:"ORD-0843", table:"01", items:6, total:1240, time:"25 min ago", payment:"Cash", status:"billed"   },
  { id:"ORD-0842", table:"06", items:3, total:920,  time:"32 min ago", payment:"UPI",  status:"settled"  },
  { id:"ORD-0841", table:"03", items:2, total:440,  time:"45 min ago", payment:"Cash", status:"settled"  },
]

// ─── PRIMITIVES ───────────────────────────────────────────
function Mono({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span style={{ fontFamily: MONO, ...style }} className={className}>{children}</span>
}

function Badge({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
      style={{ fontFamily: MONO, border: `1px solid ${color}`, color }}
    >{children}</span>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    free:     ["FREE",     C.green],
    occupied: ["OCCUPIED", C.yellow],
    bill:     ["BILL REQ", C.orange],
    settled:  ["SETTLED",  C.muted],
    received: ["RECEIVED", C.yellow],
    served:   ["SERVED",   C.green],
    billed:   ["BILLED",   C.orange],
  }
  const [label, color] = map[status] ?? ["UNKNOWN", C.muted]
  return (
    <span
      className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap"
      style={{ fontFamily: MONO, border: `1px solid ${color}`, color }}
    >{label}</span>
  )
}

function VegDot({ veg }: { veg: boolean }) {
  return (
    <div className="w-3 h-3 flex-shrink-0 flex items-center justify-center"
      style={{ border: `1.5px solid ${veg ? C.green : C.orange}` }}>
      <div className="w-1.5 h-1.5" style={{ background: veg ? C.green : C.orange, borderRadius: veg ? "50%" : 0 }} />
    </div>
  )
}

function ScoreBadge({ score }: { score: string }) {
  const map: Record<string, [string, string]> = {
    star:        ["STAR",        C.yellow],
    puzzle:      ["PUZZLE",      C.orange],
    sleeper:     ["SLEEPER",     C.green],
    dead_weight: ["DEAD WEIGHT", C.muted],
  }
  const [label, color] = map[score] ?? ["—", C.muted]
  return <Badge color={color}>{label}</Badge>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[9px] font-bold tracking-widest uppercase mb-1"
      style={{ fontFamily: MONO, color: C.orange }}>{children}</div>
  )
}

function WireframePlaceholder({ label, height = "100px" }: { label?: string; height?: string | number }) {
  return (
    <div 
      className="relative overflow-hidden w-full flex items-center justify-center" 
      style={{ 
        height: height,
        border: `1px dashed ${C.border}`,
        background: `rgba(24, 24, 27, 0.4)`
      }}
    >
      <svg className="absolute inset-0 w-full h-full text-[#3F3F46]/30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="0.75" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="0.75" />
      </svg>
      {label && (
        <span 
          className="absolute text-[8px] font-mono tracking-wider uppercase bg-[#09090B] border px-1.5 py-0.5 select-none pointer-events-none"
          style={{ borderColor: C.border, color: C.muted }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

function WireframeAvatar({ letter }: { letter: string }) {
  return (
    <div 
      className="w-8 h-8 relative flex items-center justify-center select-none"
      style={{ border: `1px dashed ${C.border}`, borderRadius: '50% !important', background: C.s1 }}
    >
      <svg className="absolute inset-0 w-full h-full text-[#3F3F46]/30" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <span className="relative text-[10px] font-bold font-mono" style={{ color: C.orange }}>{letter}</span>
    </div>
  )
}


// ─── PHONE FRAME ─────────────────────────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden flex-shrink-0"
      style={{ width: 375, height: 780, background: C.s0, border: `2px solid ${C.border}` }}>
      <div className="flex justify-between items-center px-5 py-2"
        style={{ background: C.s0, borderBottom: `1px solid ${C.border}` }}>
        <Mono className="text-[10px]" style={{ color: C.text }}>9:41</Mono>
        <div className="flex gap-2 items-center">
          <Signal size={10} color={C.text} />
          <Wifi size={10} color={C.text} />
          <Battery size={10} color={C.text} />
        </div>
      </div>
      <div className="overflow-y-auto" style={{ height: "calc(100% - 28px)" }}>
        {children}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  CUSTOMER MENU APP
// ═══════════════════════════════════════════════════════════
function CustomerApp() {
  const [screen, setScreen]         = useState<CustomerScreen>("menu")
  const [activeCat, setActiveCat]   = useState("All")
  const [cart, setCart]             = useState<{item: typeof ITEMS[0]; qty:number}[]>([])
  const [itemModal, setItemModal]   = useState<typeof ITEMS[0] | null>(null)

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const subtotal  = cart.reduce((s, c) => s + c.item.price * c.qty, 0)
  const gst       = Math.round(subtotal * 0.05)
  const total     = subtotal + gst

  const addToCart = (item: typeof ITEMS[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.item.id === item.id)
      return ex ? prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
                : [...prev, { item, qty: 1 }]
    })
  }
  const removeOne = (id: number) => {
    setCart(prev => prev.map(c => c.item.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))
  }

  const SCREENLABELS: Record<CustomerScreen, string> = {
    qr:"B-01 QR Landing", menu:"B-02 Menu Home", cart:"B-04 Cart", confirmed:"B-05 Confirmed", bill:"B-06 Live Bill",
  }
  const TABS = [
    { id:"menu" as CustomerScreen, icon: BookOpen, label:"Menu" },
    { id:"cart" as CustomerScreen, icon: ShoppingCart, label:"Cart" },
    { id:"bill" as CustomerScreen, icon: Receipt, label:"Bill" },
  ]

  const BottomNav = () => (
    <div className="flex" style={{ borderTop:`1px solid ${C.border}`, background:C.s0, flexShrink:0 }}>
      {TABS.map(t => (
        <button key={t.id} className="flex-1 flex flex-col items-center py-2 gap-0.5"
          onClick={() => setScreen(t.id)}>
          <t.icon size={16} color={screen === t.id ? C.orange : C.muted} />
          <Mono className="text-[9px]" style={{ color: screen === t.id ? C.orange : C.muted }}>{t.label}</Mono>
        </button>
      ))}
    </div>
  )

  const screens: Record<CustomerScreen, React.ReactNode> = {
    // ── B-01 QR Landing ───
    qr: (
      <div className="flex flex-col h-full" style={{ background: C.s0 }}>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-3xl font-bold uppercase tracking-tight mb-1" style={{ color:C.text }}>SPICE GARDEN</div>
          <Mono className="text-[10px] mb-8" style={{ color:C.muted }}>MULTI-CUISINE · BANJARA HILLS</Mono>
          <div className="w-28 h-28 mb-8 flex items-center justify-center"
            style={{ border:`2px solid ${C.border}` }}>
            <QrCode size={60} color={C.muted} />
          </div>
          <Mono className="text-3xl font-bold mb-2" style={{ color:C.text }}>TABLE 07</Mono>
          <div className="text-sm mb-10" style={{ color:C.muted }}>Fetching your menu…</div>
          <div className="w-full h-1 mb-2" style={{ background:C.s3 }}>
            <div className="h-full w-3/4" style={{ background:C.orange }} />
          </div>
          <Mono className="text-[9px] mb-8" style={{ color:C.muted }}>LOADING MENU DATA</Mono>
          <button className="px-8 py-3 text-xs font-bold uppercase tracking-wider"
            style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
            onClick={() => setScreen("menu")}>
            CONTINUE TO MENU →
          </button>
        </div>
        <BottomNav />
      </div>
    ),

    // ── B-02 Menu Home ───
    menu: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div>
            <div className="font-bold text-sm uppercase" style={{ color:C.text }}>Spice Garden</div>
            <Mono className="text-[9px]" style={{ color:C.muted }}>TABLE 07</Mono>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => setScreen("cart")}>
              <ShoppingCart size={18} color={C.text} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full"
                  style={{ background:C.orange, color:"#fff" }}>{cartCount}</span>
              )}
            </div>
          </div>
        </div>

        {/* Filter strip */}
        <div className="flex gap-2 px-4 py-2 overflow-x-auto"
          style={{ borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          {["All","Veg Only","Non-Veg","Popular",...CATEGORIES].map(f => (
            <button key={f}
              className="flex-shrink-0 px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
              style={{
                fontFamily:MONO,
                background: activeCat===f ? C.orange : "transparent",
                color:      activeCat===f ? "#fff"    : C.muted,
                border:     `1px solid ${activeCat===f ? C.orange : C.border}`,
              }}
              onClick={() => setActiveCat(f)}>{f}</button>
          ))}
        </div>

        {/* AI strip */}
        <div className="px-4 py-3" style={{ background:C.s2, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <Mono className="text-[9px] mb-2" style={{ color:C.yellow }}>⚡ AI PICKS FOR YOU</Mono>
          <div className="flex gap-2 overflow-x-auto">
            {ITEMS.filter(i => i.score === "star").map(item => (
              <div key={item.id} className="flex-shrink-0 px-3 py-2 min-w-[110px]"
                style={{ background:C.s3, border:`1px solid ${C.border}` }}>
                <Mono className="text-[8px]" style={{ color:C.yellow }}>CHEF'S PICK</Mono>
                <div className="text-xs font-bold mt-0.5 leading-tight" style={{ color:C.text }}>{item.name}</div>
                <div className="text-xs mt-0.5" style={{ color:C.orange }}>₹{item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Discount banner */}
        {ITEMS.some(i => i.discount > 0) && (
          <div className="px-4 py-2 text-xs font-bold"
            style={{ background:`${C.yellow}22`, borderBottom:`1px solid ${C.yellow}44`, color:C.yellow, fontFamily:MONO, flexShrink:0 }}>
            🔥 15% OFF on Butter Chicken — LIMITED TIME
          </div>
        )}

        {/* Menu grid */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {CATEGORIES.map(cat => {
            const catItems = ITEMS.filter(i => activeCat === "All" || activeCat === cat ? i.cat === cat : false)
            if (catItems.length === 0 && activeCat !== "All") return null
            const filtered = activeCat === "All" ? ITEMS.filter(i => i.cat === cat) : catItems
            if (filtered.length === 0) return null
            return (
              <div key={cat} className="mb-5">
                <Mono className="text-[9px] font-bold uppercase mb-2 pb-2 block"
                  style={{ color:C.orange, borderBottom:`1px solid ${C.border}` }}>{cat}</Mono>
                <div className="grid grid-cols-2 gap-2">
                  {filtered.map(item => (
                    <div key={item.id} className="cursor-pointer"
                      style={{ border:`1px solid ${C.border}`, background:C.s2 }}
                      onClick={() => setItemModal(item)}>
                      <div className="w-full h-20 relative flex items-center justify-center">
                        <WireframePlaceholder height="80px" label={`img: ${item.name.toLowerCase().replace(/\s+/g, '_')}.png`} />
                        {item.discount > 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-bold"
                            style={{ background:C.yellow, color:"#000", fontFamily:MONO }}>-{item.discount}%</div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="flex items-start gap-1 mb-1">
                          <VegDot veg={item.veg} />
                          <div className="text-[11px] font-bold leading-tight" style={{ color:C.text }}>{item.name}</div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-bold" style={{ color:C.orange }}>₹{item.price}</span>
                          <button
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold"
                            style={{ background:C.orange, color:"#fff" }}
                            onClick={e => { e.stopPropagation(); addToCart(item) }}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Sticky cart bar */}
        {cartCount > 0 && (
          <div className="mx-4 mb-2 p-3 flex justify-between items-center cursor-pointer"
            style={{ background:C.orange }}
            onClick={() => setScreen("cart")}>
            <Mono className="text-xs font-bold" style={{ color:"#fff" }}>{cartCount} ITEMS</Mono>
            <Mono className="text-xs font-bold" style={{ color:"#fff" }}>VIEW CART · ₹{total}</Mono>
          </div>
        )}
        <BottomNav />

        {/* Item modal */}
        {itemModal && (
          <div className="absolute inset-0 flex flex-col justify-end" style={{ background:"rgba(0,0,0,0.88)", zIndex:50 }}>
            <div style={{ background:C.s0, border:`2px solid ${C.border}`, borderBottom:"none" }}>
              <div className="flex justify-between items-center px-4 py-3"
                style={{ borderBottom:`1px solid ${C.border}` }}>
                <div className="font-bold text-sm uppercase" style={{ color:C.text }}>{itemModal.name}</div>
                <button onClick={() => setItemModal(null)}><X size={16} color={C.muted} /></button>
              </div>
              <div className="h-36 flex items-center justify-center">
                <WireframePlaceholder height="144px" label={`img: ${itemModal.name.toLowerCase().replace(/\s+/g, '_')}.png`} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <VegDot veg={itemModal.veg} />
                  <span className="text-xs" style={{ color:C.muted }}>{itemModal.veg ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>
                <div className="text-sm mb-3" style={{ color:C.muted }}>{itemModal.desc}</div>
                <div className="text-2xl font-bold mb-4" style={{ color:C.orange }}>₹{itemModal.price}</div>
                <input placeholder="Special instructions (optional)" className="w-full px-3 py-2 text-xs mb-4"
                  style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none", fontFamily:SANS }} />
                <button className="w-full py-3 font-bold uppercase text-xs tracking-wider"
                  style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
                  onClick={() => { addToCart(itemModal); setItemModal(null) }}>
                  ADD TO CART — ₹{itemModal.price}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    ),

    // ── B-04 Cart ───
    cart: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <button onClick={() => setScreen("menu")}><ChevronLeft size={18} color={C.text} /></button>
          <div>
            <div className="font-bold text-sm uppercase" style={{ color:C.text }}>YOUR ORDER</div>
            <Mono className="text-[9px]" style={{ color:C.muted }}>TABLE 07</Mono>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingCart size={40} color={C.border} className="mb-4" />
              <div className="text-sm mb-3" style={{ color:C.muted }}>Nothing here yet</div>
              <button className="text-xs font-bold uppercase" style={{ color:C.orange, fontFamily:MONO }}
                onClick={() => setScreen("menu")}>BROWSE MENU →</button>
            </div>
          ) : (
            <>
              {cart.map(({ item, qty }) => (
                <div key={item.id} className="flex items-center gap-3 py-3"
                  style={{ borderBottom:`1px solid ${C.border}` }}>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color:C.text }}>{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color:C.orange }}>₹{item.price} × {qty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 flex items-center justify-center"
                      style={{ border:`1px solid ${C.border}`, color:C.text }}
                      onClick={() => removeOne(item.id)}><Minus size={10} /></button>
                    <Mono className="text-sm w-4 text-center" style={{ color:C.text }}>{qty}</Mono>
                    <button className="w-6 h-6 flex items-center justify-center"
                      style={{ background:C.orange, color:"#fff" }}
                      onClick={() => addToCart(item)}><Plus size={10} /></button>
                  </div>
                  <span className="text-sm font-bold w-14 text-right" style={{ color:C.text }}>₹{item.price*qty}</span>
                </div>
              ))}
              <div className="pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm" style={{ color:C.muted }}>Subtotal</span>
                  <span className="text-sm font-bold" style={{ color:C.text }}>₹{subtotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm" style={{ color:C.muted }}>GST (5%)</span>
                  <span className="text-sm" style={{ color:C.muted }}>₹{gst}</span>
                </div>
                <div className="flex justify-between py-3 mt-1" style={{ borderTop:`2px solid ${C.border}` }}>
                  <span className="text-sm font-bold uppercase" style={{ color:C.text }}>Total</span>
                  <span className="text-xl font-bold" style={{ color:C.orange }}>₹{total}</span>
                </div>
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 flex-shrink-0" style={{ borderTop:`1px solid ${C.border}` }}>
            <button className="w-full py-4 font-bold uppercase text-sm tracking-wider mb-2"
              style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
              onClick={() => setScreen("confirmed")}>
              PLACE ORDER · ₹{total}
            </button>
            <button className="w-full py-2 text-xs font-bold uppercase"
              style={{ color:C.muted, fontFamily:MONO }}
              onClick={() => setScreen("menu")}>CONTINUE ORDERING</button>
          </div>
        )}
        <BottomNav />
      </div>
    ),

    // ── B-05 Order Confirmed ───
    confirmed: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-6"
            style={{ background:C.green }}>
            <Check size={32} color="#000" strokeWidth={3} />
          </div>
          <div className="text-2xl font-bold uppercase mb-2" style={{ color:C.text }}>Order Received!</div>
          <div className="text-sm mb-1" style={{ color:C.muted }}>Your waiter has been notified</div>
          <Mono className="text-xs mb-8" style={{ color:C.green }}>TABLE 07</Mono>
          <div className="w-full mb-6" style={{ background:C.s2, border:`1px solid ${C.border}` }}>
            <div className="px-4 py-3" style={{ borderBottom:`1px solid ${C.border}` }}>
              <Mono className="text-[9px]" style={{ color:C.orange }}>ORDER SUMMARY</Mono>
            </div>
            {cart.map(({ item, qty }) => (
              <div key={item.id} className="flex justify-between px-4 py-2">
                <span className="text-xs" style={{ color:C.text }}>{item.name} × {qty}</span>
                <span className="text-xs font-bold" style={{ color:C.text }}>₹{item.price*qty}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2" style={{ borderTop:`1px solid ${C.border}` }}>
              <span className="text-xs font-bold" style={{ color:C.text }}>Total (incl. GST)</span>
              <span className="text-sm font-bold" style={{ color:C.orange }}>₹{total}</span>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button className="flex-1 py-3 text-xs font-bold uppercase"
              style={{ border:`1px solid ${C.border}`, color:C.text, fontFamily:MONO }}
              onClick={() => setScreen("menu")}>ORDER MORE</button>
            <button className="flex-1 py-3 text-xs font-bold uppercase"
              style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
              onClick={() => setScreen("bill")}>SEE BILL</button>
          </div>
          <div className="mt-6 text-[10px]" style={{ color:C.muted }}>Auto-redirecting in 8 sec…</div>
        </div>
        <BottomNav />
      </div>
    ),

    // ── B-06 Live Bill ───
    bill: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <button onClick={() => setScreen("menu")}><ChevronLeft size={18} color={C.text} /></button>
          <div>
            <div className="font-bold text-sm uppercase" style={{ color:C.text }}>LIVE BILL</div>
            <Mono className="text-[9px]" style={{ color:C.green }}>TABLE 07 — ACTIVE SESSION</Mono>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <Mono className="text-[9px] mb-3 block" style={{ color:C.muted }}>ROUND 1 — {new Date().toLocaleTimeString()}</Mono>
          {(cart.length > 0 ? cart : ITEMS.slice(0,3).map(item => ({ item, qty:1 }))).map(({ item, qty }) => (
            <div key={item.id} className="flex justify-between py-2.5" style={{ borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div className="text-sm" style={{ color:C.text }}>{item.name}</div>
                <div className="text-xs mt-0.5" style={{ color:C.muted }}>Qty: {qty}</div>
              </div>
              <span className="text-sm font-bold" style={{ color:C.text }}>₹{item.price*qty}</span>
            </div>
          ))}
          <div className="mt-4 p-3" style={{ background:C.s2, border:`1px solid ${C.border}` }}>
            <div className="flex justify-between py-1.5">
              <span className="text-xs" style={{ color:C.muted }}>Subtotal</span>
              <span className="text-xs" style={{ color:C.text }}>₹{subtotal || 660}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-xs" style={{ color:C.muted }}>GST (5%)</span>
              <span className="text-xs" style={{ color:C.text }}>₹{gst || 33}</span>
            </div>
            <div className="flex justify-between py-2 mt-2" style={{ borderTop:`1px solid ${C.border}` }}>
              <span className="text-sm font-bold uppercase" style={{ color:C.text }}>Grand Total</span>
              <span className="text-xl font-bold" style={{ color:C.orange }}>₹{total || 693}</span>
            </div>
          </div>
          <div className="mt-3 text-xs" style={{ color:C.muted }}>Payment: Cash · UPI · Card at table</div>
        </div>
        <div className="p-4 flex-shrink-0" style={{ borderTop:`1px solid ${C.border}` }}>
          <button className="w-full py-4 font-bold uppercase text-sm tracking-wider"
            style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>
            📞 CALL WAITER / REQUEST BILL
          </button>
        </div>
        <BottomNav />
      </div>
    ),
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(SCREENLABELS) as CustomerScreen[]).map(s => (
          <button key={s}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ fontFamily:MONO, background:screen===s ? C.orange:"transparent", color:screen===s?"#fff":C.muted, border:`1px solid ${screen===s?C.orange:C.border}` }}
            onClick={() => setScreen(s)}>{SCREENLABELS[s]}</button>
        ))}
      </div>
      <div>
        <Mono className="text-[9px] text-center block mb-3" style={{ color:C.muted }}>CUSTOMER MENU APP — QR PWA · MOBILE-FIRST</Mono>
        <PhoneFrame>{screens[screen]}</PhoneFrame>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  WAITER APP
// ═══════════════════════════════════════════════════════════
function WaiterApp() {
  const [screen, setScreen]         = useState<WaiterScreen>("floor")
  const [selTable, setSelTable]     = useState(TABLES[0])

  const SCREENLABELS: Record<WaiterScreen, string> = {
    login:"C-01 Login", floor:"C-02 Floor View", table:"C-03 Table Detail", notifications:"C-05 Notifications",
  }

  const TABS = [
    { id:"floor" as WaiterScreen, icon:Grid, label:"Tables" },
    { id:"notifications" as WaiterScreen, icon:Bell, label:"Alerts" },
    { id:"menu_ref" as unknown as WaiterScreen, icon:BookOpen, label:"Menu" },
    { id:"profile" as unknown as WaiterScreen, icon:Users, label:"Profile" },
  ]

  const BottomNav = () => (
    <div className="flex flex-shrink-0" style={{ borderTop:`1px solid ${C.border}` }}>
      {TABS.map(t => (
        <button key={String(t.id)} className="flex-1 flex flex-col items-center py-2 gap-0.5"
          onClick={() => { if (t.id === "floor" || t.id === "notifications") setScreen(t.id) }}>
          <t.icon size={16} color={screen===t.id ? C.orange : C.muted} />
          <Mono className="text-[9px]" style={{ color:screen===t.id ? C.orange : C.muted }}>{t.label}</Mono>
        </button>
      ))}
    </div>
  )

  const screens: Record<WaiterScreen, React.ReactNode> = {
    login: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-4xl font-bold uppercase tracking-tight mb-1" style={{ color:C.text }}>
            D<span style={{ color:C.orange }}>M</span>X
          </div>
          <Mono className="text-[9px] mb-12" style={{ color:C.muted }}>WAITER APP · SPICE GARDEN</Mono>
          <div className="w-full space-y-3">
            <div>
              <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>EMAIL</Mono>
              <input className="w-full px-3 py-3 text-sm"
                style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none", fontFamily:SANS }}
                placeholder="raju@spicegarden.in" />
            </div>
            <div>
              <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>PASSWORD</Mono>
              <input type="password" className="w-full px-3 py-3 text-sm"
                style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none", fontFamily:SANS }}
                placeholder="••••••••" />
            </div>
            <button className="w-full py-4 mt-4 font-bold uppercase tracking-wider text-sm"
              style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
              onClick={() => setScreen("floor")}>LOGIN</button>
          </div>
          <div className="mt-8 text-xs text-center" style={{ color:C.muted }}>Contact admin to reset password</div>
        </div>
      </div>
    ),

    floor: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <div>
            <div className="font-bold text-sm uppercase" style={{ color:C.text }}>FLOOR VIEW</div>
            <Mono className="text-[9px]" style={{ color:C.muted }}>SPICE GARDEN</Mono>
          </div>
          <div className="flex items-center gap-3">
            <Mono className="text-[9px] px-2 py-1" style={{ color:C.text, border:`1px solid ${C.border}` }}>RAJU K.</Mono>
            <div className="relative">
              <Bell size={16} color={C.text} />
              <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full"
                style={{ background:C.orange, color:"#fff" }}>3</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 flex-shrink-0" style={{ borderBottom:`1px solid ${C.border}` }}>
          {[["6","ACTIVE"],["3","FREE"],["48","TODAY"]].map(([v,l], i) => (
            <div key={l} className="flex flex-col items-center py-3"
              style={{ borderRight: i<2 ? `1px solid ${C.border}` : "none" }}>
              <div className="text-2xl font-bold" style={{ color:C.orange, fontFamily:MONO }}>{v}</div>
              <Mono className="text-[8px]" style={{ color:C.muted }}>{l}</Mono>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-shrink-0" style={{ borderBottom:`1px solid ${C.border}` }}>
          {["ALL","ACTIVE","BILL REQ","FREE"].map((tab,i) => (
            <button key={tab} className="flex-1 py-2 text-[8px] font-bold"
              style={{ fontFamily:MONO, color:i===0?C.orange:C.muted, borderBottom:i===0?`2px solid ${C.orange}`:"none" }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table grid */}
        <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-2 content-start">
          {TABLES.map(t => (
            <button key={t.id}
              className="p-2 flex flex-col gap-1 text-left"
              style={{
                border:`2px solid ${t.status==="bill"?C.orange:t.status==="occupied"?C.yellow:C.border}`,
                background:C.s2,
              }}
              onClick={() => { setSelTable(t); setScreen("table") }}>
              <Mono className="text-2xl font-bold" style={{ color:C.text }}>{t.num}</Mono>
              <StatusPill status={t.status} />
              {t.status !== "free" && (
                <>
                  <div className="text-xs font-bold" style={{ color:C.orange }}>₹{t.total}</div>
                  <Mono className="text-[8px]" style={{ color:C.muted }}>{t.time}</Mono>
                </>
              )}
            </button>
          ))}
        </div>
        <BottomNav />
      </div>
    ),

    table: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <button onClick={() => setScreen("floor")}><ChevronLeft size={18} color={C.text} /></button>
          <div className="flex-1">
            <div className="font-bold text-sm uppercase" style={{ color:C.text }}>TABLE {selTable.num}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusPill status={selTable.status} />
              <Mono className="text-[9px]" style={{ color:C.muted }}>OPEN {selTable.time}</Mono>
            </div>
          </div>
        </div>

        {selTable.status === "bill" && (
          <div className="px-4 py-2 text-xs font-bold flex-shrink-0"
            style={{ background:`${C.orange}22`, borderBottom:`1px solid ${C.orange}`, color:C.orange, fontFamily:MONO }}>
            ⚡ CUSTOMER REQUESTED BILL — ₹{selTable.total}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <Mono className="text-[9px] mb-3 block" style={{ color:C.muted }}>ROUND 1 — 7:42 PM</Mono>
          {ITEMS.slice(0,4).map((item, idx) => (
            <div key={item.id} className="flex justify-between py-2.5"
              style={{ borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div className="text-sm" style={{ color:C.text }}>{item.name}</div>
                {idx===1 && <div className="text-[10px] italic mt-0.5" style={{ color:C.muted }}>extra spicy, no onion</div>}
                <div className="text-xs mt-0.5" style={{ color:C.muted }}>×{idx+1}</div>
              </div>
              <span className="text-sm font-bold" style={{ color:C.text }}>₹{item.price*(idx+1)}</span>
            </div>
          ))}
          <div className="mt-4 p-3" style={{ background:C.s2, border:`1px solid ${C.border}` }}>
            <div className="flex justify-between py-1.5">
              <span className="text-xs" style={{ color:C.muted }}>Subtotal</span>
              <span className="text-xs" style={{ color:C.text }}>₹{selTable.total}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-xs" style={{ color:C.muted }}>GST (5%)</span>
              <span className="text-xs" style={{ color:C.text }}>₹{Math.round(selTable.total*0.05)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2" style={{ borderTop:`1px solid ${C.border}` }}>
              <span className="text-sm font-bold" style={{ color:C.text }}>Grand Total</span>
              <span className="text-xl font-bold" style={{ color:C.orange }}>₹{Math.round(selTable.total*1.05)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex gap-2 flex-shrink-0" style={{ borderTop:`1px solid ${C.border}` }}>
          <button className="flex-1 py-3 text-xs font-bold uppercase"
            style={{ border:`1px solid ${C.border}`, color:C.text, fontFamily:MONO }}>+ ADD ITEM</button>
          <button className="flex-1 py-3 text-xs font-bold uppercase"
            style={{ background:C.green, color:"#000", fontFamily:MONO }}
            onClick={() => setScreen("floor")}>✓ MARK SETTLED</button>
        </div>
        <BottomNav />
      </div>
    ),

    notifications: (
      <div className="flex flex-col h-full" style={{ background:C.s0 }}>
        <div className="flex justify-between items-center px-4 py-3 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <div className="font-bold text-sm uppercase" style={{ color:C.text }}>ALERTS</div>
          <button className="text-[10px] font-bold" style={{ color:C.orange, fontFamily:MONO }}>CLEAR ALL</button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { type:"bill",  table:"01", msg:"Bill requested",   detail:"₹1,240 · 6 items", time:"2 min ago",  unread:true  },
            { type:"order", table:"04", msg:"New order placed", detail:"5 items · ₹1,840", time:"4 min ago",  unread:true  },
            { type:"bill",  table:"06", msg:"Bill requested",   detail:"₹960 · 3 items",   time:"8 min ago",  unread:true  },
            { type:"order", table:"07", msg:"New order placed", detail:"2 items · ₹420",   time:"15 min ago", unread:false },
            { type:"order", table:"02", msg:"New order placed", detail:"3 items · ₹680",   time:"22 min ago", unread:false },
          ].map((n, i) => (
            <div key={i}
              className="flex items-start gap-3 px-4 py-4 cursor-pointer"
              style={{
                borderBottom:`1px solid ${C.border}`,
                borderLeft:`3px solid ${n.unread ? (n.type==="bill"?C.orange:C.green) : "transparent"}`,
                background: n.unread ? C.s2 : "transparent",
              }}
              onClick={() => setScreen("table")}>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background:C.s3 }}>
                {n.type==="bill"
                  ? <Receipt size={14} color={C.orange} />
                  : <ShoppingCart size={14} color={C.green} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Mono className="text-xs font-bold" style={{ color:C.text }}>TABLE {n.table}</Mono>
                  <Mono className="text-[9px]" style={{ color:C.muted }}>{n.time}</Mono>
                </div>
                <div className="text-xs mt-0.5" style={{ color:C.text }}>{n.msg}</div>
                <div className="text-[10px] mt-0.5" style={{ color:C.muted }}>{n.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    ),
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {(Object.keys(SCREENLABELS) as WaiterScreen[]).map(s => (
          <button key={s}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ fontFamily:MONO, background:screen===s?C.orange:"transparent", color:screen===s?"#fff":C.muted, border:`1px solid ${screen===s?C.orange:C.border}` }}
            onClick={() => setScreen(s)}>{SCREENLABELS[s]}</button>
        ))}
      </div>
      <div>
        <Mono className="text-[9px] text-center block mb-3" style={{ color:C.muted }}>WAITER APP — REACT NATIVE / ANDROID · OFFLINE-CAPABLE</Mono>
        <PhoneFrame>{screens[screen]}</PhoneFrame>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  ADMIN DASHBOARD — sub-page components
// ═══════════════════════════════════════════════════════════
function AdminOverview({ onNav }: { onNav:(s:AdminScreen)=>void }) {
  return (
    <div>
      {/* Live stat row */}
      <div className="grid grid-cols-4 mb-8" style={{ border:`1px solid ${C.border}` }}>
        {[
          { label:"Active Tables",   val:"6",       sub:"/ 9 total",   color:C.orange },
          { label:"Orders This Hour",val:"14",      sub:"+3 vs last",  color:C.yellow },
          { label:"Revenue Today",   val:"₹28,640", sub:"+14%",        color:C.green  },
          { label:"Avg Order Value", val:"₹612",    sub:"+6%",         color:C.text   },
        ].map((s,i) => (
          <div key={s.label} className="p-6 text-center" style={{ borderRight:i<3?`1px solid ${C.border}`:"none" }}>
            <div className="text-4xl font-bold mb-1" style={{ color:s.color }}>{s.val}</div>
            <Mono className="text-[9px] block mb-1" style={{ color:C.muted }}>{s.label.toUpperCase()}</Mono>
            <span className="text-[10px]" style={{ color:C.muted }}>{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Order feed */}
        <div style={{ border:`1px solid ${C.border}` }}>
          <div className="flex justify-between items-center px-5 py-4"
            style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
            <Mono className="text-[10px]" style={{ color:C.text }}>LIVE ORDER FEED</Mono>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background:C.green }} />
              <Mono className="text-[9px]" style={{ color:C.green }}>LIVE</Mono>
            </div>
          </div>
          {ORDERS.map(o => (
            <div key={o.id} className="flex items-center gap-3 px-5 py-3"
              style={{ borderBottom:`1px solid ${C.border}` }}>
              <Mono className="text-[10px] w-20" style={{ color:C.orange }}>{o.id}</Mono>
              <Mono className="text-[10px]" style={{ color:C.muted }}>T{o.table}</Mono>
              <span className="text-xs flex-1" style={{ color:C.text }}>{o.items} items</span>
              <span className="text-xs font-bold mr-2" style={{ color:C.text }}>₹{o.total}</span>
              <StatusPill status={o.status} />
            </div>
          ))}
        </div>

        {/* Floor map */}
        <div style={{ border:`1px solid ${C.border}` }}>
          <div className="px-5 py-4" style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
            <Mono className="text-[10px]" style={{ color:C.text }}>FLOOR MAP — LIVE</Mono>
          </div>
          <div className="p-4 grid grid-cols-3 gap-2">
            {TABLES.map(t => (
              <div key={t.id} className="p-2"
                style={{ border:`2px solid ${t.status==="bill"?C.orange:t.status==="occupied"?C.yellow:C.border}`, background:C.s2 }}>
                <Mono className="text-xl font-bold block" style={{ color:C.text }}>{t.num}</Mono>
                <StatusPill status={t.status} />
                {t.status!=="free" && <div className="text-xs font-bold mt-1" style={{ color:C.orange }}>₹{t.total}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue ticker */}
      <div className="flex justify-between items-center px-6 py-4"
        style={{ background:C.s2, border:`1px solid ${C.border}` }}>
        <Mono className="text-[10px]" style={{ color:C.muted }}>LIVE GMV TODAY</Mono>
        <div className="text-3xl font-bold" style={{ color:C.green }}>₹28,640</div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} color={C.green} />
          <span className="text-xs font-bold" style={{ color:C.green }}>+14% vs yesterday</span>
        </div>
        <button className="text-xs font-bold uppercase"
          style={{ color:C.orange, fontFamily:MONO }}
          onClick={() => onNav("analytics")}>SEE ANALYTICS →</button>
      </div>
    </div>
  )
}

function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState<"items"|"discounts"|"qr">("items")
  const [activeCat, setActiveCat] = useState("Starters")
  return (
    <div>
      <div className="flex mb-6" style={{ borderBottom:`1px solid ${C.border}` }}>
        {(["items","discounts","qr"] as const).map(tab => (
          <button key={tab}
            className="px-5 py-3 text-xs font-bold uppercase tracking-wider"
            style={{ fontFamily:MONO, color:activeTab===tab?C.orange:C.muted, borderBottom:activeTab===tab?`2px solid ${C.orange}`:"2px solid transparent" }}
            onClick={() => setActiveTab(tab)}>
            {tab==="qr"?"QR CODES":tab.toUpperCase()}
          </button>
        ))}
        <button className="ml-auto px-5 py-2 text-xs font-bold uppercase"
          style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>+ ADD ITEM</button>
      </div>

      {activeTab==="items" && (
        <div className="flex gap-5">
          <div className="w-44 flex-shrink-0" style={{ border:`1px solid ${C.border}` }}>
            <div className="px-4 py-3" style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
              <Mono className="text-[9px]" style={{ color:C.muted }}>CATEGORIES</Mono>
            </div>
            {CATEGORIES.map(cat => (
              <button key={cat}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left"
                style={{ color:activeCat===cat?C.text:C.muted, background:activeCat===cat?C.s2:"transparent", borderLeft:`3px solid ${activeCat===cat?C.orange:"transparent"}`, borderBottom:`1px solid ${C.border}` }}
                onClick={() => setActiveCat(cat)}>
                {cat}
                <span className="text-[10px]" style={{ color:C.muted }}>{ITEMS.filter(i=>i.cat===cat).length}</span>
              </button>
            ))}
            <button className="w-full px-4 py-3 text-xs text-left" style={{ color:C.orange, fontFamily:MONO }}>+ CATEGORY</button>
          </div>
          <div className="flex-1" style={{ border:`1px solid ${C.border}` }}>
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
              <Search size={14} color={C.muted} />
              <input className="flex-1 text-sm bg-transparent outline-none" style={{ color:C.text }} placeholder="Search items…" />
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ background:C.s3 }}>
                  {["Name","Price","Cost","Score","Avail",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-bold"
                      style={{ color:C.muted, fontFamily:MONO, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ITEMS.filter(i=>i.cat===activeCat).map(item => (
                  <tr key={item.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <VegDot veg={item.veg} />
                        <span className="text-sm" style={{ color:C.text }}>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color:C.orange }}>₹{item.price}</td>
                    <td className="px-4 py-3 text-sm" style={{ color:C.muted }}>₹{Math.round(item.price*0.38)}</td>
                    <td className="px-4 py-3"><ScoreBadge score={item.score} /></td>
                    <td className="px-4 py-3">
                      <div className="w-10 h-5 flex items-center px-0.5 cursor-pointer"
                        style={{ background:C.green }}>
                        <div className="w-4 h-4 ml-auto" style={{ background:"#fff" }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button><Edit size={12} color={C.muted} /></button>
                        <button><Trash2 size={12} color={C.orange} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab==="discounts" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm" style={{ color:C.muted }}>Time-limited discounts on any menu item</div>
            <button className="px-4 py-2 text-xs font-bold uppercase"
              style={{ background:C.yellow, color:"#000", fontFamily:MONO }}>+ NEW DISCOUNT</button>
          </div>
          {[
            { item:"Butter Chicken", pct:15, expires:"11:00 PM", sold:23 },
            { item:"Dal Makhani",    pct:20, expires:"9:00 PM",  sold:8  },
          ].map(d => (
            <div key={d.item} className="flex items-center gap-4 px-4 py-3 mb-2"
              style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
              <div className="w-12 h-12 flex items-center justify-center text-sm font-bold"
                style={{ background:C.yellow, color:"#000" }}>-{d.pct}%</div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color:C.text }}>{d.item}</div>
                <Mono className="text-[9px]" style={{ color:C.muted }}>EXPIRES {d.expires} · {d.sold} UNITS SOLD</Mono>
              </div>
              <button className="text-[10px] font-bold" style={{ color:C.orange, fontFamily:MONO }}>END DISCOUNT</button>
            </div>
          ))}
        </div>
      )}

      {activeTab==="qr" && (
        <div className="grid grid-cols-5 gap-3">
          {TABLES.map(t => (
            <div key={t.id} className="p-4 flex flex-col items-center gap-2"
              style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
              <div className="w-20 h-20 flex items-center justify-center">
                <WireframePlaceholder height="80px" label={`qr: t_${t.num}`} />
              </div>
              <Mono className="text-sm font-bold" style={{ color:C.text }}>TABLE {t.num}</Mono>
              <button className="text-[9px] font-bold uppercase" style={{ color:C.orange, fontFamily:MONO }}>DOWNLOAD</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminAnalytics() {
  const [period, setPeriod] = useState("Today")
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {["Today","This Week","This Month","Custom"].map(p => (
          <button key={p}
            className="px-4 py-2 text-xs font-bold uppercase"
            style={{ fontFamily:MONO, background:period===p?C.orange:"transparent", color:period===p?"#fff":C.muted, border:`1px solid ${period===p?C.orange:C.border}` }}
            onClick={() => setPeriod(p)}>{p}</button>
        ))}
        <button className="ml-auto px-4 py-2 text-xs flex items-center gap-2"
          style={{ border:`1px solid ${C.border}`, color:C.muted }}>
          <Download size={13} />Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label:"Total Revenue",  val:"₹28,640", sub:"+14%", up:true  },
          { label:"Total Orders",   val:"89",       sub:"+8%",  up:true  },
          { label:"Avg Order Value",val:"₹612",     sub:"+6%",  up:true  },
          { label:"Peak Hour",      val:"7–8 PM",   sub:"22 orders", up:null },
          { label:"Best Seller",    val:"Butter Chicken", sub:"34 orders", up:null },
          { label:"Total Covers",   val:"167",      sub:"+11%", up:true  },
        ].map(k => (
          <div key={k.label} className="p-4" style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
            <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>{k.label.toUpperCase()}</Mono>
            <div className="text-2xl font-bold mb-1" style={{ color:C.text }}>{k.val}</div>
            <div className="flex items-center gap-1">
              {k.up===true && <TrendingUp size={10} color={C.green} />}
              {k.up===false && <TrendingDown size={10} color={C.orange} />}
              <span className="text-[10px]" style={{ color:k.up===true?C.green:k.up===false?C.orange:C.muted }}>{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="p-5 mb-6" style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
        <Mono className="text-[10px] block mb-4" style={{ color:C.muted }}>REVENUE — {period.toUpperCase()}</Mono>
        <div className="relative h-28">
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-3">
            {["₹30K","₹20K","₹10K","₹0"].map(l => <Mono key={l} className="text-[9px]" style={{ color:C.muted }}>{l}</Mono>)}
          </div>
          <div className="ml-12 h-full flex items-end gap-1">
            {[45,62,38,71,88,55,92,75,83,67,74,89,95,78].map((h,i) => (
              <div key={i} className="flex-1 relative" style={{ height:`${h}%`, border:`1px dashed ${C.orange}`, background:`rgba(249, 115, 22, 0.05)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[7px] text-[#A1A1AA] font-mono">{h}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top items table */}
      <div style={{ border:`1px solid ${C.border}` }}>
        <div className="px-4 py-3" style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
          <Mono className="text-[10px]" style={{ color:C.muted }}>TOP ITEMS — {period.toUpperCase()}</Mono>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background:C.s3 }}>
              {["Item","Orders","Revenue","Margin","Score"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[9px] font-bold"
                  style={{ color:C.muted, fontFamily:MONO }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ITEMS.slice(0,5).map((item,i) => (
              <tr key={item.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td className="px-4 py-3 text-sm" style={{ color:C.text }}>{item.name}</td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color:C.text }}>{34-i*5}</td>
                <td className="px-4 py-3 text-sm" style={{ color:C.orange }}>₹{(34-i*5)*item.price}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color:i<2?C.green:C.muted }}>{60-i*8}%</span>
                </td>
                <td className="px-4 py-3"><ScoreBadge score={item.score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminOrders() {
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 flex-1"
          style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
          <Search size={14} color={C.muted} />
          <input className="flex-1 text-sm bg-transparent outline-none" style={{ color:C.text }} placeholder="Search by ID, table, amount…" />
        </div>
        <button className="px-4 py-2 flex items-center gap-2" style={{ border:`1px solid ${C.border}`, color:C.muted }}>
          <Filter size={14} /><span className="text-xs">Filter</span>
        </button>
        <button className="px-4 py-2 flex items-center gap-2" style={{ border:`1px solid ${C.border}`, color:C.muted }}>
          <Download size={14} /><span className="text-xs">Export</span>
        </button>
      </div>
      <div style={{ border:`1px solid ${C.border}` }}>
        <table className="w-full">
          <thead>
            <tr style={{ background:C.s3 }}>
              {["Order ID","Table","Time","Items","Total","Payment","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-bold"
                  style={{ color:C.muted, fontFamily:MONO, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id} className="cursor-pointer" style={{ borderBottom:`1px solid ${C.border}` }}>
                <td className="px-4 py-3"><Mono className="text-[11px]" style={{ color:C.orange }}>{o.id}</Mono></td>
                <td className="px-4 py-3 text-sm" style={{ color:C.text }}>{o.table}</td>
                <td className="px-4 py-3 text-sm" style={{ color:C.muted }}>{o.time}</td>
                <td className="px-4 py-3 text-sm" style={{ color:C.text }}>{o.items}</td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color:C.orange }}>₹{o.total}</td>
                <td className="px-4 py-3"><Mono className="text-[10px]" style={{ color:C.muted }}>{o.payment}</Mono></td>
                <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                <td className="px-4 py-3"><button><Eye size={14} color={C.muted} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminProfit() {
  const cats = [
    { key:"star",        label:"STAR",        color:C.yellow, desc:"High sales · High margin — Feature & protect" },
    { key:"puzzle",      label:"PUZZLE",      color:C.orange, desc:"High sales · Low margin — Raise price or cut cost" },
    { key:"sleeper",     label:"SLEEPER",     color:C.green,  desc:"Low sales · High margin — Push a discount to activate" },
    { key:"dead_weight", label:"DEAD WEIGHT", color:C.muted,  desc:"Low sales · Low margin — Remove it. It's hurting you." },
  ]
  const btns: Record<string, { label:string; color:string }> = {
    star:        { label:"FEATURE",       color:C.yellow },
    puzzle:      { label:"RAISE PRICE",   color:C.orange },
    sleeper:     { label:"PUSH DISCOUNT", color:C.green  },
    dead_weight: { label:"REMOVE ITEM",   color:C.muted  },
  }
  return (
    <div>
      <div className="mb-6 px-5 py-4"
        style={{ background:`${C.yellow}11`, border:`1px solid ${C.yellow}33` }}>
        <Mono className="text-[9px] block mb-1" style={{ color:C.yellow }}>WEEKLY AI ANALYSIS</Mono>
        <div className="text-sm" style={{ color:C.text }}>1 Dead Weight item draining ~₹4,200/week. 2 Sleepers ready to activate with a discount push.</div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {cats.map(cat => {
          const catItems = ITEMS.filter(i=>i.score===cat.key)
          return (
            <div key={cat.key} style={{ border:`2px solid ${cat.color}33` }}>
              <div className="px-4 py-3 flex items-center gap-3"
                style={{ background:`${cat.color}11`, borderBottom:`1px solid ${cat.color}33` }}>
                <div className="text-sm font-bold" style={{ color:cat.color, fontFamily:MONO }}>{cat.label}</div>
                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold"
                  style={{ background:cat.color, color:"#000" }}>{catItems.length}</div>
              </div>
              <div className="px-4 py-2 text-xs" style={{ color:C.muted, borderBottom:`1px solid ${C.border}` }}>{cat.desc}</div>
              {catItems.length===0
                ? <div className="px-4 py-6 text-xs" style={{ color:C.muted }}>No items in this category</div>
                : catItems.map(item => (
                    <div key={item.id} className="px-4 py-3 flex items-center justify-between"
                      style={{ borderBottom:`1px solid ${C.border}` }}>
                      <div>
                        <div className="text-sm font-bold" style={{ color:C.text }}>{item.name}</div>
                        <div className="text-xs" style={{ color:C.muted }}>₹{item.price} · Margin: {cat.key==="star"||cat.key==="sleeper"?"62%":"18%"}</div>
                      </div>
                      <button className="text-[9px] px-2 py-1 font-bold"
                        style={{ border:`1px solid ${btns[cat.key].color}`, color:btns[cat.key].color, fontFamily:MONO }}>
                        {btns[cat.key].label}
                      </button>
                    </div>
                  ))
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AdminBilling() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:"Today's Revenue", val:"₹28,640", color:C.green  },
          { label:"Bills Settled",   val:"89",       color:C.text   },
          { label:"Cash·UPI·Card",   val:"34%·48%·18%", color:C.muted },
        ].map(s => (
          <div key={s.label} className="p-5" style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
            <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>{s.label.toUpperCase()}</Mono>
            <div className="text-2xl font-bold" style={{ color:s.color }}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{ border:`1px solid ${C.border}` }}>
        <div className="px-4 py-3" style={{ borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
          <Mono className="text-[10px]" style={{ color:C.muted }}>ACTIVE TABLE BILLS</Mono>
        </div>
        {TABLES.filter(t=>t.status!=="free").map(t => (
          <div key={t.id} className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom:`1px solid ${C.border}` }}>
            <div className="flex items-center gap-4">
              <Mono className="text-2xl font-bold" style={{ color:C.text }}>T{t.num}</Mono>
              <StatusPill status={t.status} />
              <Mono className="text-[10px]" style={{ color:C.muted }}>OPEN {t.time}</Mono>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold" style={{ color:C.orange }}>₹{t.total}</span>
              <button className="px-4 py-2 text-[10px] font-bold uppercase"
                style={{ background:C.green, color:"#000", fontFamily:MONO }}>MARK SETTLED</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminStaff() {
  const staff = [
    { name:"Raju Kumar",  role:"Waiter",  orders:34, rt:"48s",  online:true  },
    { name:"Priya Singh", role:"Waiter",  orders:28, rt:"62s",  online:true  },
    { name:"Mohan Das",   role:"Cashier", orders:0,  rt:"—",    online:true  },
    { name:"Amit Sharma", role:"Admin",   orders:0,  rt:"—",    online:false },
  ]
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-sm" style={{ color:C.muted }}>4 staff configured for Spice Garden</div>
        <button className="px-4 py-2 text-xs font-bold uppercase"
          style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>+ ADD STAFF</button>
      </div>
      <div style={{ border:`1px solid ${C.border}` }}>
        <table className="w-full">
          <thead>
            <tr style={{ background:C.s3 }}>
              {["Staff Member","Role","Orders Today","Avg Response","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-bold"
                  style={{ color:C.muted, fontFamily:MONO, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.name} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <WireframeAvatar letter={s.name[0]} />
                    <span className="text-sm font-bold" style={{ color:C.text }}>{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge color={s.role==="Admin"?C.yellow:s.role==="Waiter"?C.orange:C.green}>{s.role}</Badge>
                </td>
                <td className="px-4 py-3 text-sm font-bold" style={{ color:C.text }}>{s.orders}</td>
                <td className="px-4 py-3"><Mono className="text-sm" style={{ color:C.muted }}>{s.rt}</Mono></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background:s.online?C.green:C.muted }} />
                    <span className="text-xs" style={{ color:s.online?C.green:C.muted }}>{s.online?"Online":"Offline"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button><Edit size={13} color={C.muted} /></button>
                    <button><Trash2 size={13} color={C.orange} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="max-w-xl">
      {[
        { section:"Restaurant Info", fields:[
          { label:"Restaurant Name", val:"Spice Garden" },
          { label:"GST Number",      val:"27AAPCA1234A1Z5" },
          { label:"URL Slug",        val:"spice-garden-hyd" },
        ]},
        { section:"Billing Config", fields:[
          { label:"GST Rate (%)",          val:"5"   },
          { label:"Service Charge (%)",    val:"10"  },
          { label:"Payment Methods",       val:"Cash · UPI · Card" },
        ]},
        { section:"Branding", fields:[
          { label:"Accent Colour",    val:"#FF4D00"           },
          { label:"Customer App Logo",val:"spice-garden.png"  },
        ]},
      ].map(group => (
        <div key={group.section} className="mb-6" style={{ border:`1px solid ${C.border}` }}>
          <div className="px-4 py-3 text-[10px] font-bold uppercase"
            style={{ color:C.muted, fontFamily:MONO, borderBottom:`1px solid ${C.border}`, background:C.s2 }}>
            {group.section}
          </div>
          {group.fields.map(f => (
            <div key={f.label} className="flex items-center gap-4 px-4 py-3"
              style={{ borderBottom:`1px solid ${C.border}` }}>
              <div className="w-40 text-xs" style={{ color:C.muted }}>{f.label}</div>
              <input defaultValue={f.val} className="flex-1 px-3 py-2 text-sm"
                style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none" }} />
            </div>
          ))}
        </div>
      ))}
      <button className="px-6 py-3 text-xs font-bold uppercase"
        style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>SAVE SETTINGS</button>
    </div>
  )
}

function AdminDashboard() {
  const [screen, setScreen] = useState<AdminScreen>("overview")
  const [loggedIn, setLoggedIn] = useState(true)

  if (!loggedIn || screen === "login") {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background:C.s0 }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <div className="text-5xl font-bold uppercase tracking-tight mb-2" style={{ color:C.text }}>
              D<span style={{ color:C.orange }}>M</span>X
            </div>
            <Mono className="text-[9px]" style={{ color:C.muted }}>RESTAURANT OS — ADMIN</Mono>
          </div>
          <div className="space-y-3">
            <input className="w-full px-4 py-3"
              style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none" }}
              placeholder="admin@spicegarden.in" />
            <input type="password" className="w-full px-4 py-3"
              style={{ background:C.s3, border:`1px solid ${C.border}`, color:C.text, outline:"none" }}
              placeholder="Password" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center cursor-pointer"
                style={{ border:`1px solid ${C.border}` }}>
                <Check size={10} color={C.orange} />
              </div>
              <span className="text-xs" style={{ color:C.muted }}>Remember me (30 days)</span>
            </div>
            <button className="w-full py-4 font-bold uppercase tracking-wider text-sm mt-4"
              style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
              onClick={() => { setLoggedIn(true); setScreen("overview") }}>LOGIN</button>
          </div>
          <div className="mt-4 text-xs text-center" style={{ color:C.muted }}>
            <span style={{ color:C.orange }}>Admin</span> · Manager · Cashier roles supported
          </div>
        </div>
      </div>
    )
  }

  const NAV = [
    { id:"overview",  icon:LayoutDashboard, label:"Overview"      },
    { id:"menu",      icon:BookOpen,        label:"Menu"          },
    { id:"analytics", icon:BarChart3,       label:"Analytics"     },
    { id:"orders",    icon:FileText,        label:"Orders"        },
    { id:"profit",    icon:TrendingUp,      label:"Profit Engine" },
    { id:"billing",   icon:Receipt,         label:"Billing"       },
    { id:"staff",     icon:UserCheck,       label:"Staff"         },
    { id:"settings",  icon:Settings,        label:"Settings"      },
  ] as const

  const CONTENT: Record<AdminScreen, React.ReactNode> = {
    login:    null,
    overview: <AdminOverview onNav={setScreen} />,
    menu:     <AdminMenuPage />,
    analytics:<AdminAnalytics />,
    orders:   <AdminOrders />,
    profit:   <AdminProfit />,
    billing:  <AdminBilling />,
    staff:    <AdminStaff />,
    settings: <AdminSettings />,
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:C.s0 }}>
      {/* Sidebar */}
      <div className="flex flex-col flex-shrink-0" style={{ width:220, background:C.s1, borderRight:`1px solid ${C.border}` }}>
        <div className="px-5 py-5" style={{ borderBottom:`1px solid ${C.border}` }}>
          <div className="text-2xl font-bold uppercase tracking-tight" style={{ color:C.text }}>
            D<span style={{ color:C.orange }}>M</span>X
          </div>
          <Mono className="text-[9px]" style={{ color:C.muted }}>SPICE GARDEN</Mono>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id}
              className="w-full flex items-center gap-3 px-5 py-3 text-left"
              style={{
                background:  screen===item.id ? C.s2 : "transparent",
                borderLeft:  `3px solid ${screen===item.id ? C.orange : "transparent"}`,
                color:        screen===item.id ? C.text : C.muted,
              }}
              onClick={() => setScreen(item.id as AdminScreen)}>
              <item.icon size={15} color={screen===item.id ? C.orange : C.muted} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-5 py-4" style={{ borderTop:`1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            <WireframeAvatar letter="A" />
            <div>
              <div className="text-xs font-bold" style={{ color:C.text }}>Amit Sharma</div>
              <Mono className="text-[9px]" style={{ color:C.muted }}>ADMIN</Mono>
            </div>
            <button className="ml-auto" onClick={() => setLoggedIn(false)}>
              <LogOut size={13} color={C.muted} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex justify-between items-center px-8 py-4 flex-shrink-0"
          style={{ borderBottom:`1px solid ${C.border}` }}>
          <div>
            <div className="font-bold uppercase tracking-wide" style={{ color:C.text }}>
              {NAV.find(n=>n.id===screen)?.label}
            </div>
            <Mono className="text-[9px]" style={{ color:C.muted }}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </Mono>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={16} color={C.muted} />
              <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full"
                style={{ background:C.orange, color:"#fff" }}>5</span>
            </div>
            <button onClick={() => setLoggedIn(false)}><LogOut size={15} color={C.muted} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{CONTENT[screen]}</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  DMX WEB — Restaurant Marketing Site
// ═══════════════════════════════════════════════════════════
function DMXWeb() {
  const [screen, setScreen] = useState<WebScreen>("home")

  const SCREENLABELS: Record<WebScreen, string> = {
    home:"E-01 Home", menu:"E-02 Menu", about:"E-03 About", contact:"E-04 Contact",
  }

  const Nav = () => (
    <nav className="flex justify-between items-center px-12 py-5"
      style={{ borderBottom:`1px solid ${C.border}` }}>
      <button className="text-xl font-bold uppercase tracking-tight" style={{ color:C.text }}
        onClick={() => setScreen("home")}>SPICE GARDEN</button>
      <div className="flex gap-8">
        {(["menu","about","contact"] as WebScreen[]).map(s => (
          <button key={s} className="text-sm capitalize" style={{ color:C.muted }}
            onClick={() => setScreen(s)}>{s}</button>
        ))}
      </div>
      <button className="px-5 py-2 text-xs font-bold uppercase"
        style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>RESERVE A TABLE</button>
    </nav>
  )

  const screens: Record<WebScreen, React.ReactNode> = {
    home: (
      <div style={{ background:C.s0 }}>
        <Nav />
        {/* Hero */}
        <div className="relative px-12 py-20 grid grid-cols-2 gap-0" style={{ borderBottom:`1px solid ${C.border}` }}>
          <div>
            <SectionLabel>MULTI-CUISINE · BANJARA HILLS, HYD</SectionLabel>
            <h1 className="text-7xl font-bold uppercase leading-none tracking-tighter mb-6" style={{ color:C.text }}>
              Real Food.<br />Real Fast.
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color:C.muted, lineHeight:1.75 }}>
              Authentic Indian cuisine crafted with passion. Order from your table — no waiting, no fuss. Just great food, every time.
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 text-sm font-bold uppercase"
                style={{ background:C.orange, color:"#fff", fontFamily:MONO }}
                onClick={() => setScreen("menu")}>VIEW MENU</button>
              <button className="px-6 py-3 text-sm font-bold uppercase"
                style={{ border:`1px solid ${C.border}`, color:C.text, fontFamily:MONO }}>GET DIRECTIONS</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center" style={{ marginRight:-48, marginTop:-80, marginBottom:-80 }}>
            <WireframePlaceholder height="320px" label="hero_visual: dining_ambiance.jpg" />
          </div>
        </div>

        {/* Why us */}
        <div className="grid grid-cols-3" style={{ borderBottom:`1px solid ${C.border}` }}>
          {[
            { title:"Order at Your Pace", desc:"Scan the QR at your table. Browse, add items, place your order — all from your phone. No app download." },
            { title:"Fresh Every Service", desc:"Locally sourced, cooked to order. No shortcuts, no pre-cooked batches. Just fresh, honest food." },
            { title:"One-Tap Bill", desc:"See your running total live. Tap to call your waiter — they arrive in under a minute, total in hand." },
          ].map((item, i) => (
            <div key={item.title} className="px-10 py-12"
              style={{ borderRight:i<2?`1px solid ${C.border}`:"none" }}>
              <div className="w-8 h-0.5 mb-5" style={{ background:C.orange }} />
              <div className="text-lg font-bold uppercase mb-3" style={{ color:C.text }}>{item.title}</div>
              <div className="text-sm" style={{ color:C.muted, lineHeight:1.85 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Menu preview */}
        <div className="px-12 py-14" style={{ borderBottom:`1px solid ${C.border}` }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <SectionLabel>OUR MENU</SectionLabel>
              <div className="text-3xl font-bold uppercase" style={{ color:C.text }}>Today's Highlights</div>
            </div>
            <button className="text-xs font-bold uppercase" style={{ color:C.orange, fontFamily:MONO }}
              onClick={() => setScreen("menu")}>FULL MENU →</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {ITEMS.slice(0,4).map(item => (
              <div key={item.id} style={{ border:`1px solid ${C.border}` }}>
                <div className="h-32 flex items-center justify-center">
                  <WireframePlaceholder height="128px" label={`img: ${item.name.toLowerCase().replace(/\s+/g, '_')}.png`} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1"><VegDot veg={item.veg} />
                    <div className="text-sm font-bold uppercase" style={{ color:C.text }}>{item.name}</div>
                  </div>
                  <div className="text-xs mb-2" style={{ color:C.muted }}>{item.desc}</div>
                  <div className="font-bold" style={{ color:C.orange }}>₹{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-12 py-14 text-center" style={{ background:C.orange }}>
          <div className="text-4xl font-bold uppercase tracking-tight mb-4" style={{ color:"#fff" }}>Ready to Visit?</div>
          <p className="text-lg mb-8" style={{ color:"rgba(255,255,255,0.75)" }}>Walk in anytime or reserve a table in advance.</p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 text-sm font-bold uppercase"
              style={{ background:"#fff", color:C.orange, fontFamily:MONO }}>BOOK VIA WHATSAPP</button>
            <button className="px-8 py-3 text-sm font-bold uppercase"
              style={{ border:"1px solid rgba(255,255,255,0.4)", color:"#fff", fontFamily:MONO }}>GOOGLE MAPS</button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between px-12 py-8" style={{ borderTop:`1px solid ${C.border}` }}>
          <div>
            <div className="text-xl font-bold uppercase mb-1" style={{ color:C.text }}>SPICE GARDEN</div>
            <div className="text-xs" style={{ color:C.muted }}>Banjara Hills · Hyderabad · Open 11am–11pm</div>
            <div className="text-xs mt-1" style={{ color:C.muted }}>Powered by <span style={{ color:C.orange }}>DMX</span></div>
          </div>
          <div className="flex gap-6 items-start">
            {["Menu","About","Contact","Instagram","Google Maps"].map(l => (
              <span key={l} className="text-xs cursor-pointer hover:text-white" style={{ color:C.muted }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    ),

    menu: (
      <div style={{ background:C.s0 }}>
        <Nav />
        <div className="px-12 py-12">
          <SectionLabel>OUR MENU</SectionLabel>
          <div className="text-4xl font-bold uppercase mb-8" style={{ color:C.text }}>Everything We Serve</div>
          {CATEGORIES.map(cat => (
            <div key={cat} className="mb-10">
              <div className="text-lg font-bold uppercase mb-4 pb-2"
                style={{ color:C.text, borderBottom:`2px solid ${C.orange}` }}>{cat}</div>
              <div className="grid grid-cols-2 gap-3">
                {ITEMS.filter(i=>i.cat===cat).map(item => (
                  <div key={item.id} className="flex gap-4 p-4"
                    style={{ border:`1px solid ${C.border}`, background:C.s2 }}>
                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                      <WireframePlaceholder height="80px" label={`img: ${item.name.toLowerCase().replace(/\s+/g, '_')}.png`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <VegDot veg={item.veg} />
                        <div className="text-sm font-bold" style={{ color:C.text }}>{item.name}</div>
                      </div>
                      <div className="text-xs mb-2" style={{ color:C.muted }}>{item.desc}</div>
                      <div className="font-bold" style={{ color:C.orange }}>₹{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    about: (
      <div style={{ background:C.s0 }}>
        <Nav />
        <div className="px-12 py-16 max-w-3xl">
          <SectionLabel>ABOUT US</SectionLabel>
          <h1 className="text-5xl font-bold uppercase leading-tight mb-8" style={{ color:C.text }}>Our Story</h1>
          <p className="text-lg mb-6" style={{ color:C.muted, lineHeight:1.85 }}>
            Spice Garden was founded in 2012 with a simple belief: great food doesn't need to be complicated. For over a decade we've served Hyderabad authentic Indian cuisine that feels like home.
          </p>
          <p className="text-lg mb-12" style={{ color:C.muted, lineHeight:1.85 }}>
            Our kitchen runs on fresh ingredients sourced daily from local markets. Every recipe has been passed down through generations and refined with care.
          </p>
          <div className="grid grid-cols-3 mb-12" style={{ border:`1px solid ${C.border}` }}>
            {[["12+","Years Serving Hyd"],["200+","Items on Menu"],["4.8★","Google Rating"]].map(([v,l],i) => (
              <div key={l} className="p-8 text-center" style={{ borderRight:i<2?`1px solid ${C.border}`:"none" }}>
                <div className="text-4xl font-bold mb-2" style={{ color:C.orange }}>{v}</div>
                <div className="text-xs" style={{ color:C.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    contact: (
      <div style={{ background:C.s0 }}>
        <Nav />
        <div className="px-12 py-16 grid grid-cols-2 gap-16">
          <div>
            <SectionLabel>FIND US</SectionLabel>
            <div className="text-4xl font-bold uppercase mb-8" style={{ color:C.text }}>Visit Us</div>
            {[
              { icon:MapPin, label:"Address", val:"Road No. 12, Banjara Hills, Hyderabad — 500034" },
              { icon:Phone,  label:"Phone",   val:"+91 40 2345 6789" },
              { icon:Mail,   label:"Email",   val:"hello@spicegarden.in" },
              { icon:Clock,  label:"Hours",   val:"Mon–Sun: 11:00 AM – 11:00 PM" },
            ].map(info => (
              <div key={info.label} className="flex gap-4 mb-6">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background:C.s2, border:`1px solid ${C.border}` }}>
                  <info.icon size={14} color={C.orange} />
                </div>
                <div>
                  <div className="text-xs font-bold mb-1" style={{ color:C.muted }}>{info.label.toUpperCase()}</div>
                  <div className="text-sm" style={{ color:C.text }}>{info.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <SectionLabel>SEND A MESSAGE</SectionLabel>
            <div className="space-y-3 mt-4">
              {["Your Name","Phone / Email"].map(p => (
                <input key={p} className="w-full px-4 py-3 text-sm"
                  style={{ background:C.s2, border:`1px solid ${C.border}`, color:C.text, outline:"none" }}
                  placeholder={p} />
              ))}
              <textarea className="w-full px-4 py-3 text-sm" rows={4}
                style={{ background:C.s2, border:`1px solid ${C.border}`, color:C.text, outline:"none", resize:"none", fontFamily:SANS }}
                placeholder="Message or table reservation request…" />
              <button className="w-full py-3 text-sm font-bold uppercase"
                style={{ background:C.orange, color:"#fff", fontFamily:MONO }}>SEND MESSAGE</button>
            </div>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(SCREENLABELS) as WebScreen[]).map(s => (
          <button key={s}
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ fontFamily:MONO, background:screen===s?C.orange:"transparent", color:screen===s?"#fff":C.muted, border:`1px solid ${screen===s?C.orange:C.border}` }}
            onClick={() => setScreen(s)}>{SCREENLABELS[s]}</button>
        ))}
      </div>
      <div style={{ border:`1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 px-4 py-2.5"
          style={{ background:C.s3, borderBottom:`1px solid ${C.border}` }}>
          <div className="flex gap-1.5">
            {[C.border,C.border,C.border].map((c,i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background:c }} />
            ))}
          </div>
          <div className="flex-1 px-3 py-1 text-xs"
            style={{ background:C.s0, border:`1px solid ${C.border}`, color:C.muted, fontFamily:MONO }}>
            https://spicegarden.in/{screen==="home"?"":screen}
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight:"70vh" }}>
          {screens[screen]}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  APP SELECTOR
// ═══════════════════════════════════════════════════════════
function AppSelector({ onSelect }: { onSelect:(app:AppView)=>void }) {
  const apps = [
    { id:"customer" as AppView, num:"01", title:"Customer Menu App",  sub:"QR-Based PWA",           color:C.green,  tech:["Next.js 14","PWA","Socket.io","TailwindCSS"], screens:["QR Landing","Menu Home","Item Detail","Cart","Confirmed","Live Bill"], desc:"Mobile-first ordering. Customers scan QR, browse live menu, place orders, and request bill — zero friction, zero app download." },
    { id:"waiter"   as AppView, num:"02", title:"Waiter App",         sub:"React Native · Android",  color:C.yellow, tech:["React Native","Expo","FCM Push","Offline Queue"], screens:["Login","Floor View","Table Detail","Add Item","Notifications"], desc:"Native Android app. Instant push alerts for orders and bill requests. Live floor map with table status. Works offline." },
    { id:"admin"    as AppView, num:"03", title:"Admin Dashboard",    sub:"Next.js Web App",         color:C.orange, tech:["Next.js 14","Recharts","Real-Time","Role-Based"], screens:["Overview","Menu Mgmt","Analytics","Orders","Profit Engine","Billing","Staff","Settings"], desc:"Full business intelligence. Live ops monitoring, sales analytics, menu management, profit AI engine, staff control." },
    { id:"web"      as AppView, num:"04", title:"DMX Web",            sub:"Restaurant Website",      color:C.blue,   tech:["Next.js","Local SEO","Schema Markup","GEO"], screens:["Home","Menu","About","Contact"], desc:"SEO-optimised restaurant website. Google Business setup, AI search indexing. Brings new customers via digital discovery." },
  ]

  return (
    <div className="min-h-screen p-12" style={{ background:C.s0 }}>
      {/* Cover */}
      <div className="mb-16">
        <div className="text-[120px] font-bold uppercase leading-none tracking-tighter mb-4" style={{ color:C.text }}>
          D<span style={{ color:C.orange }}>M</span>X
        </div>
        <div className="text-xl max-w-xl mb-5" style={{ color:C.muted, lineHeight:1.7 }}>
          The Restaurant Operating System — complete wireframe prototype. All 4 apps, 22+ screens, full DMX design language.
        </div>
        <div className="flex gap-3 flex-wrap">
          {apps.map(a => <Badge key={a.id} color={a.color}>{a.title}</Badge>)}
        </div>
      </div>

      {/* App grid */}
      <div className="grid grid-cols-2 gap-5 mb-12">
        {apps.map(app => (
          <button key={app.id} className="p-8 text-left"
            style={{ border:`2px solid ${C.border}`, background:C.s2, cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=app.color; el.style.boxShadow=`6px 6px 0 ${app.color}` }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=C.border; el.style.boxShadow="none" }}
            onClick={() => onSelect(app.id)}>
            <div className="flex justify-between items-start mb-4">
              <div className="text-5xl font-bold" style={{ color:C.s3, fontFamily:MONO }}>{app.num}</div>
              <Badge color={app.color}>{app.sub}</Badge>
            </div>
            <div className="text-2xl font-bold uppercase mb-2" style={{ color:C.text }}>{app.title}</div>
            <div className="text-sm mb-6" style={{ color:C.muted, lineHeight:1.75 }}>{app.desc}</div>
            <div className="mb-4">
              <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>SCREENS</Mono>
              <div className="flex flex-wrap gap-1.5">
                {app.screens.map(s => (
                  <span key={s} className="text-[9px] px-2 py-0.5"
                    style={{ border:`1px solid ${C.border}`, color:C.muted, fontFamily:MONO }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <Mono className="text-[9px] block mb-2" style={{ color:C.muted }}>TECH STACK</Mono>
              <div className="flex flex-wrap gap-1.5">
                {app.tech.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5"
                    style={{ border:`1px solid ${app.color}55`, color:app.color, fontFamily:MONO }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ color:app.color }}>
              <span className="text-xs font-bold uppercase" style={{ fontFamily:MONO }}>EXPLORE WIREFRAMES</span>
              <span>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-4" style={{ border:`1px solid ${C.border}` }}>
        {[["4","Apps"],["22+","Screens"],["3","User Roles"],["₹55K","One-Time License"]].map(([v,l],i) => (
          <div key={l} className="py-6 text-center" style={{ borderRight:i<3?`1px solid ${C.border}`:"none" }}>
            <div className="text-3xl font-bold" style={{ color:C.orange }}>{v}</div>
            <Mono className="text-[9px] mt-1" style={{ color:C.muted }}>{l.toUpperCase()}</Mono>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [activeApp, setActiveApp] = useState<AppView>("selector")

  const APP_TABS = [
    { id:"customer" as AppView, label:"Customer App", color:C.green  },
    { id:"waiter"   as AppView, label:"Waiter App",   color:C.yellow },
    { id:"admin"    as AppView, label:"Admin",         color:C.orange },
    { id:"web"      as AppView, label:"DMX Web",       color:C.blue   },
  ]

  return (
    <div className="min-h-screen" style={{ background:C.s0, fontFamily:SANS }}>
      {/* Global nav */}
      {activeApp !== "selector" && (
        <div className="flex items-center justify-between px-6 py-3 sticky top-0 z-50"
          style={{ background:C.s0, borderBottom:`1px solid ${C.border}` }}>
          <button className="flex items-center gap-2 group" onClick={() => setActiveApp("selector")}>
            <ChevronLeft size={14} color={C.muted} />
            <span className="text-xl font-bold uppercase tracking-tight" style={{ color:C.text }}>
              D<span style={{ color:C.orange }}>M</span>X
            </span>
          </button>
          <div className="flex gap-1">
            {APP_TABS.map(t => (
              <button key={t.id}
                className="px-3 py-1.5 text-[10px] font-bold uppercase"
                style={{
                  fontFamily:MONO,
                  background: activeApp===t.id ? t.color : "transparent",
                  color:      activeApp===t.id ? (t.id==="waiter"?"#000":"#fff") : C.muted,
                  border:     `1px solid ${activeApp===t.id ? t.color : C.border}`,
                }}
                onClick={() => setActiveApp(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {activeApp === "selector" && <AppSelector onSelect={setActiveApp} />}
      {activeApp === "customer" && (
        <div className="p-10"><CustomerApp /></div>
      )}
      {activeApp === "waiter" && (
        <div className="p-10"><WaiterApp /></div>
      )}
      {activeApp === "admin" && <AdminDashboard />}
      {activeApp === "web" && (
        <div className="p-10"><DMXWeb /></div>
      )}
    </div>
  )
}
