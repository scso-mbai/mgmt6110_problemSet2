import React, { useState, useEffect, useCallback } from 'react';
import { CARDS_DATA } from './data';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { CardDetailScreen } from './components/CardDetailScreen';
import { CartScreen } from './components/CartScreen';
import { StoreLocatorModal } from './components/StoreLocatorModal';
import { CartItem, TradingCard, CardStoreInventory, BaseLocationStatus } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail' | 'cart'>('home');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // User coordinates from browser's Geolocation API
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);

  // Live location states: loading, empty, refused, unreachable, success
  const [baseLocation, setBaseLocation] = useState<string | null>(null);
  const [baseStatus, setBaseStatus] = useState<BaseLocationStatus>('loading');
  const [baseSentence, setBaseSentence] = useState<string>('Loading...');

  // Fetch live base location using browser's built-in Geolocation API via serverless function
  const fetchBaseLocation = useCallback(async () => {
    setBaseStatus('loading');
    setBaseSentence('Loading...');

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setBaseLocation(null);
      setBaseStatus('unreachable');
      setBaseSentence('Unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords || {};

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
          setBaseLocation(null);
          setBaseStatus('empty');
          setBaseSentence('Location Empty');
          return;
        }

        // Store user coordinates for local Haversine distance calculations
        setUserCoords({ latitude, longitude });

        try {
          const response = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
          const contentType = response.headers.get('content-type') || '';

          if (!contentType.includes('application/json')) {
            setBaseLocation(null);
            setBaseStatus('unreachable');
            setBaseSentence('Unavailable');
            return;
          }

          if (!response.ok) {
            setBaseLocation(null);
            if (response.status === 502 || response.status === 504) {
              setBaseStatus('unreachable');
              setBaseSentence('Unavailable');
            } else {
              setBaseStatus('refused');
              setBaseSentence('Access Refused');
            }
            return;
          }

          const data = await response.json();
          const areaName = data?.area || data?.name;
          if (!areaName || typeof areaName !== 'string' || areaName.trim() === '') {
            setBaseLocation(null);
            setBaseStatus('empty');
            setBaseSentence('Location Empty');
            return;
          }

          // Live location returned
          setBaseLocation(areaName.trim());
          setBaseStatus('success');
          setBaseSentence(areaName.trim());
        } catch {
          setBaseLocation(null);
          setBaseStatus('unreachable');
          setBaseSentence('Unavailable');
        }
      },
      async (err) => {
        if (err.code === 1 /* PERMISSION_DENIED */) {
          setBaseLocation(null);
          setBaseStatus('refused');
          setBaseSentence('Access Refused');
        } else if (err.code === 2 /* POSITION_UNAVAILABLE */ || err.code === 3 /* TIMEOUT */) {
          setBaseLocation(null);
          setBaseStatus('unreachable');
          setBaseSentence('Unavailable');
        } else {
          // Attempt serverless function fallback
          try {
            const fallbackRes = await fetch('/api/location');
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const fbArea = fallbackData?.area || fallbackData?.name;
              if (fbArea) {
                setBaseLocation(fbArea.trim());
                setBaseStatus('success');
                setBaseSentence(fbArea.trim());
                return;
              }
            }
          } catch {
            // ignore fallback
          }

          setBaseLocation(null);
          setBaseStatus('unreachable');
          setBaseSentence('Unavailable');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    fetchBaseLocation();
  }, [fetchBaseLocation]);

  // Scroll to top when switching between screens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen, selectedCardId]);

  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setCurrentScreen('detail');
  };

  const handleNavigateHome = () => {
    setCurrentScreen('home');
    setSelectedCardId(null);
  };

  const handleNavigateCart = () => {
    setCurrentScreen('cart');
  };

  const handleAddToCart = (card: TradingCard, store: CardStoreInventory) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.cardId === card.id && item.storeId === store.storeId
      );

      if (existingIndex > -1) {
        return prevItems.map((item, idx) => {
          if (idx === existingIndex) {
            const nextQty = Math.min(item.availableStock, item.quantity + 1);
            return { ...item, quantity: nextQty };
          }
          return item;
        });
      }

      const newItem: CartItem = {
        cardId: card.id,
        cardName: card.name,
        cardSubtitle: card.subtitle,
        cardNumber: card.cardNumber,
        inkColor: card.inkColor,
        rarity: card.rarity,
        artId: card.artId,
        storeId: store.storeId,
        storeName: store.storeName,
        storeLocation: store.location,
        storeNeighborhood: store.neighborhood,
        price: store.price,
        quantity: 1,
        availableStock: store.quantity,
        condition: store.condition,
      };

      return [...prevItems, newItem];
    });
  };

  const handleUpdateQuantity = (cardId: string, storeId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.cardId === cardId && item.storeId === storeId) {
          const nextQty = Math.max(1, Math.min(item.availableStock, item.quantity + delta));
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cardId: string, storeId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.cardId === cardId && item.storeId === storeId))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const selectedCard = CARDS_DATA.find((c) => c.id === selectedCardId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Persistent Navigation Header */}
      <Navbar
        currentScreen={currentScreen}
        onNavigateHome={handleNavigateHome}
        onNavigateCart={handleNavigateCart}
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        cartItemCount={totalCartCount}
        selectedCardName={selectedCard?.name}
        baseLocation={baseLocation}
        baseStatus={baseStatus}
        baseSentence={baseSentence}
        onRetryLocation={fetchBaseLocation}
      />

      {/* Main Content Area: Screen 1, Screen 2, or Screen 3 */}
      <div className="flex-1">
        {currentScreen === 'cart' ? (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigateHome={handleNavigateHome}
            onSelectCard={handleSelectCard}
          />
        ) : currentScreen === 'detail' && selectedCard ? (
          <CardDetailScreen
            card={selectedCard}
            onBack={handleNavigateHome}
            onAddToCart={handleAddToCart}
            onNavigateCart={handleNavigateCart}
            baseLocation={baseLocation}
            userCoords={userCoords}
          />
        ) : (
          <HomeScreen
            cards={CARDS_DATA}
            onSelectCard={handleSelectCard}
          />
        )}
      </div>

      {/* Singapore Hobby Store Locator Modal */}
      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
        userCoords={userCoords}
        baseLocationName={baseLocation}
      />

      {/* Footer with context reminder */}
      <footer id="app-footer" className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p>© 2026 TCG Singles Exchange · Singapore Hobby Collective</p>
            <p className="text-slate-500 mt-0.5">
              Compare verified store stock, distances, and prices without reloading
            </p>
          </div>
          <div className="text-slate-400 text-xs sm:text-right">
            <span>Live area provided by </span>
            <span id="geolocation-api-badge" className="text-slate-300 font-medium">
              Browser Geolocation API
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

