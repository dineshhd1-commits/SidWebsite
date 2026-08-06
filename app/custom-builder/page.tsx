'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, Camera, Utensils, MapPin, Sparkles, CheckCircle, ClipboardList, RefreshCw } from 'lucide-react';
import { useEventBuilder } from '@/lib/store/event-builder-context';
import { getEventTypes } from '@/lib/data/event-types';
import { EventType } from '@/lib/types/catalog';
import { ProgressStepper, BuilderStepDef } from '@/components/builder/ProgressStepper';
import { CartSidebar } from '@/components/builder/CartSidebar';
import { CartMobileBar } from '@/components/builder/CartMobileBar';
import { CartDrawer } from '@/components/builder/CartDrawer';
import { EmptyState, LoadingState } from '@/components/builder/EmptyState';
import { ChangeEventTypeModal } from '@/components/builder/ChangeEventTypeModal';
import { StepConfirmationModal } from '@/components/builder/StepConfirmationModal';
import { EventDetailsSummaryCard } from '@/components/builder/EventDetailsSummaryCard';
import { EventDetailsStep } from './steps/EventDetailsStep';
import { DecorationStep } from './steps/DecorationStep';
import { PhotographyStep } from './steps/PhotographyStep';
import { CateringStep } from './steps/CateringStep';
import { VenueStep } from './steps/VenueStep';
import { AdditionalServicesStep } from './steps/AdditionalServicesStep';
import { ReviewCartStep } from './steps/ReviewCartStep';
import { GoldButton } from '@/components/ui/gold-button';
import { getCartItemCount, getEstimatedTotal } from '@/lib/builder/selectors';
import { getEventDetailsFieldChecks, getStepStatus } from '@/lib/builder/validation';

const STEP_DEFS: BuilderStepDef[] = [
  { title: 'Event Details', icon: <ClipboardList className="w-4 h-4" /> },
  { title: 'Decoration', icon: <Palette className="w-4 h-4" /> },
  { title: 'Photography', icon: <Camera className="w-4 h-4" /> },
  { title: 'Catering', icon: <Utensils className="w-4 h-4" /> },
  { title: 'Venue', icon: <MapPin className="w-4 h-4" /> },
  { title: 'Additional Services', icon: <Sparkles className="w-4 h-4" /> },
  { title: 'Review & Cart', icon: <CheckCircle className="w-4 h-4" /> },
];

const STEP_WELCOME_MESSAGES = [
  '',
  "Now choose your Decoration package.",
  "Let's pick your Photography & Videography.",
  "Now let's build your Catering menu.",
  "Time to choose your Venue.",
  'Add any Additional Services you need.',
  "Let's review your complete package before you submit.",
];

const QUOTE_ID_PREFIX = 'SID-2026';
const CATERING_STEP_INDEX = 3;

export default function CustomBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <LoadingState label="Loading event builder..." />
        </div>
      }
    >
      <CustomBuilderPageInner />
    </Suspense>
  );
}

function CustomBuilderPageInner() {
  const {
    state,
    isLoaded,
    setEventType,
    changeEventType,
    selectPackage,
    goToStep,
    nextStep,
    prevStep,
    updateEventDetails,
    setCateringTiming,
    toggleCateringMenuItem,
    updateCateringMenuItemQuantity,
    addToCart,
    removeFromCart,
    updateQuantity,
    replaceInCart,
    clearCart,
  } = useEventBuilder();
  const searchParams = useSearchParams();
  const stepContentRef = useRef<HTMLDivElement>(null);

  const [eventTypes, setEventTypes] = useState<EventType[] | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [packagePreloaded, setPackagePreloaded] = useState(false);
  const [pendingEventTypeId, setPendingEventTypeId] = useState<string | null>(null);
  const [showStepConfirmation, setShowStepConfirmation] = useState(false);

  useEffect(() => {
    getEventTypes().then(setEventTypes);
  }, []);

  // "Customize This Package" from /packages links here with ?package=<id> - preload it once.
  useEffect(() => {
    const packageId = searchParams?.get('package');
    if (packageId && !packagePreloaded && isLoaded) {
      if (!state.eventTypeId) setEventType('wedding');
      selectPackage(packageId);
      setPackagePreloaded(true);
    }
  }, [searchParams, packagePreloaded, isLoaded, state.eventTypeId, setEventType, selectPackage]);

  // Auto-scroll to the top of the step content whenever the active step changes.
  useEffect(() => {
    stepContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [state.currentStepIndex]);

  // Warn before leaving the tab while a customization is in progress - the data
  // itself is already auto-saved, this is just a "are you sure" safety net.
  useEffect(() => {
    const hasActiveCustomization = !!state.eventTypeId || Object.keys(state.cart).length > 0;
    if (!hasActiveCustomization) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.eventTypeId, state.cart]);

  if (!isLoaded || eventTypes === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <LoadingState label="Loading event builder..." />
      </div>
    );
  }

  const selectedEventType = eventTypes.find((et) => et.id === state.eventTypeId) || null;
  const cartItemCount = getCartItemCount(state);
  const pendingEventType = pendingEventTypeId ? eventTypes.find((et) => et.id === pendingEventTypeId) || null : null;

  const handleEventTypeChange = (newEventTypeId: string) => {
    if (newEventTypeId === state.eventTypeId) return;
    if (cartItemCount > 0) {
      setPendingEventTypeId(newEventTypeId);
    } else if (!state.eventTypeId) {
      setEventType(newEventTypeId);
    } else {
      changeEventType(newEventTypeId);
    }
  };

  const currentStepIndex = Math.min(state.currentStepIndex, STEP_DEFS.length - 1);
  const quoteId = `${QUOTE_ID_PREFIX}-${(state.eventTypeId || 'evt').slice(0, 3).toUpperCase()}`;
  const isCatalogReady = !!selectedEventType?.isCatalogReady;
  const stepStatuses = STEP_DEFS.map((_, i) => getStepStatus(state, i, STEP_DEFS.length - 1));

  const cateringTimingMissing = currentStepIndex === CATERING_STEP_INDEX && !state.cateringTiming;

  const handleNextClick = () => {
    if (cateringTimingMissing) return;
    if (currentStepIndex === 0) {
      const { optional } = getEventDetailsFieldChecks(state);
      if (optional.some((f) => !f.filled)) {
        setShowStepConfirmation(true);
        return;
      }
    }
    nextStep(STEP_DEFS.length - 1);
  };

  const renderStepContent = () => {
    if (currentStepIndex === 0) {
      return (
        <EventDetailsStep
          eventTypes={eventTypes}
          selectedEventTypeId={state.eventTypeId}
          onEventTypeChange={handleEventTypeChange}
          eventDetails={state.eventDetails}
          onChange={updateEventDetails}
        />
      );
    }

    if (!selectedEventType) {
      return (
        <EmptyState
          title="Select an event type to continue"
          description="Choose what you're celebrating in the Event Details step first - it decides which services and packages we show you next."
        />
      );
    }

    if (!isCatalogReady && currentStepIndex < STEP_DEFS.length - 1) {
      return (
        <EmptyState
          title={`${selectedEventType.name} packages are being finalized`}
          description="We're still building out our visual package builder for this event type. Tell us what you have in mind and our team will put together a custom quote for you."
          actionLabel="Request A Custom Quote"
          onAction={() => (window.location.href = '/contact')}
        />
      );
    }

    switch (currentStepIndex) {
      case 1:
        return (
          <DecorationStep
            state={state}
            onAddToCart={(item) => addToCart(item, 1, 'paid_extra')}
            onRemoveFromCart={removeFromCart}
            onReplace={(oldId, item) => replaceInCart(oldId, item, 1, 'paid_extra')}
          />
        );
      case 2:
        return (
          <PhotographyStep
            state={state}
            onAddToCart={(item) => addToCart(item, 1, 'paid_extra')}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        );
      case 3:
        return (
          <CateringStep
            state={state}
            onSetTiming={setCateringTiming}
            onToggleItem={toggleCateringMenuItem}
          />
        );
      case 4:
        return (
          <VenueStep
            state={state}
            onAddToCart={(item) => addToCart(item, 1, 'paid_extra')}
            onRemoveFromCart={removeFromCart}
            onReplace={(oldId, item) => replaceInCart(oldId, item, 1, 'paid_extra')}
            onSelectPackage={selectPackage}
          />
        );
      case 5:
        return (
          <AdditionalServicesStep
            state={state}
            onAddToCart={(item) => addToCart(item, 1, 'paid_extra')}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
          />
        );
      case 6:
        return <ReviewCartStep state={state} quoteId={quoteId} onGoToStep={goToStep} />;
      default:
        return null;
    }
  };

  const canGoNext = (currentStepIndex > 0 || !!state.eventTypeId) && !cateringTimingMissing;
  const { required: requiredFieldChecks, optional: optionalFieldChecks } = getEventDetailsFieldChecks(state);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24 lg:pb-10">
      <div ref={stepContentRef} className="text-center space-y-3 scroll-mt-24">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
          Plan Your Event
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          {selectedEventType ? `Customize Your ${selectedEventType.name}` : 'Craft Your Bespoke Package'}
        </h1>
        {selectedEventType && currentStepIndex > 0 && STEP_WELCOME_MESSAGES[currentStepIndex] && (
          <p className="text-maroon-700/80 text-sm max-w-xl mx-auto">{STEP_WELCOME_MESSAGES[currentStepIndex]}</p>
        )}
      </div>

      {selectedEventType && (
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="font-bold text-maroon-800 bg-gold-100 border border-gold-300 rounded-full px-4 py-1.5">
            Selected Event: {selectedEventType.name}
          </span>
          <button
            onClick={() => goToStep(0)}
            className="inline-flex items-center gap-1.5 font-bold text-gold-700 hover:text-maroon-900 underline underline-offset-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Change Event Type
          </button>
        </div>
      )}

      <ProgressStepper
        steps={STEP_DEFS}
        currentStepIndex={currentStepIndex}
        onStepClick={goToStep}
        cartCount={cartItemCount}
        estimatedTotal={getEstimatedTotal(state)}
        stepStatuses={stepStatuses}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {selectedEventType && currentStepIndex > 0 && (
            <EventDetailsSummaryCard
              eventTypeName={selectedEventType.name}
              eventDetails={state.eventDetails}
              onEdit={() => goToStep(0)}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-8"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6 border-t border-gold-300/40">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gold-100 text-maroon-900 hover:bg-gold-200 disabled:opacity-40"
            >
              Previous Step
            </button>

            {currentStepIndex < STEP_DEFS.length - 1 && (
              <GoldButton size="sm" variant="copper" onClick={handleNextClick} disabled={!canGoNext}>
                Next Step
              </GoldButton>
            )}
          </div>
          {currentStepIndex === 0 && !state.eventTypeId && (
            <p className="text-[11px] text-rose-600 font-bold -mt-4">
              We still need to know what type of event you&apos;re planning before you continue.
            </p>
          )}
          {cateringTimingMissing && (
            <p className="text-[11px] text-rose-600 font-bold -mt-4">
              Please select a Catering Timing above before you continue.
            </p>
          )}
        </div>

        <CartSidebar
          state={state}
          currentStepLabel={STEP_DEFS[currentStepIndex].title}
          totalSteps={STEP_DEFS.length}
          currentStepIndex={currentStepIndex}
          onRemove={removeFromCart}
          onContinue={() => {
            if (cateringTimingMissing) return;
            nextStep(STEP_DEFS.length - 1);
          }}
          continueLabel={currentStepIndex < STEP_DEFS.length - 1 ? 'Continue' : 'Review Complete'}
        />
      </div>

      <CartMobileBar state={state} onOpen={() => setCartDrawerOpen(true)} />
      <CartDrawer
        state={state}
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onContinue={() => setCartDrawerOpen(false)}
      />

      {pendingEventType && (
        <ChangeEventTypeModal
          newEventTypeName={pendingEventType.name}
          onContinueAndReset={() => {
            changeEventType(pendingEventType.id);
            setPendingEventTypeId(null);
          }}
          onKeepCurrentEvent={() => setPendingEventTypeId(null)}
          onCancel={() => setPendingEventTypeId(null)}
        />
      )}

      {showStepConfirmation && (
        <StepConfirmationModal
          completed={requiredFieldChecks.filter((f) => f.filled)}
          missing={optionalFieldChecks.filter((f) => !f.filled)}
          onContinue={() => {
            setShowStepConfirmation(false);
            nextStep(STEP_DEFS.length - 1);
          }}
          onEditDetails={() => setShowStepConfirmation(false)}
        />
      )}
    </div>
  );
}
