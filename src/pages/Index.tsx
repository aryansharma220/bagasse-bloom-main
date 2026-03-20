import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProcessFlow from "@/components/ProcessFlow";
import InputModule, { defaultSimulationInputs, type SimulationInputs } from "@/components/InputModule";
import Footer from "@/components/Footer";
import { runSimulation, type SimulationResults } from "@/lib/simulation";
import { createSavedScenario, getSavedScenarios, persistSavedScenarios, type SavedScenario } from "@/lib/scenario-storage";

const SimulationDashboard = lazy(() => import("@/components/SimulationDashboard"));
const FinancialAnalysis = lazy(() => import("@/components/FinancialAnalysis"));
const MarketIntelligence = lazy(() => import("@/components/MarketIntelligence"));
const AIRecommendation = lazy(() => import("@/components/AIRecommendation"));
const ScenarioComparison = lazy(() => import("@/components/ScenarioComparison"));
const SavedScenarios = lazy(() => import("@/components/SavedScenarios"));
const RegionalViabilityHeatmap = lazy(() => import("@/components/RegionalViabilityHeatmap"));

const SectionFallback = ({ copy = "Loading section..." }: { copy?: string }) => (
  <div className="container mx-auto px-6 py-10">
    <div className="glass-panel mx-auto max-w-6xl p-6 text-center text-sm text-muted-foreground">
      {copy}
    </div>
  </div>
);

const Index = () => {
  const [inputs, setInputs] = useState<SimulationInputs>(defaultSimulationInputs);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  useEffect(() => {
    setSavedScenarios(getSavedScenarios());
  }, []);

  const results: SimulationResults = useMemo(() => runSimulation(inputs), [inputs]);

  const handleInputsChange = (nextInputs: SimulationInputs) => {
    setInputs(nextInputs);
    setHasInteracted(true);
  };

  const handleFocusResults = () => {
    setHasInteracted(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSaveScenario = (name: string) => {
    const nextScenarios = [createSavedScenario(name, inputs), ...savedScenarios].slice(0, 12);
    setSavedScenarios(nextScenarios);
    persistSavedScenarios(nextScenarios);
    setHasInteracted(true);
  };

  const handleLoadScenario = (scenarioId: string) => {
    const selectedScenario = savedScenarios.find((scenario) => scenario.id === scenarioId);
    if (!selectedScenario) return;

    setInputs(selectedScenario.inputs);
    handleFocusResults();
  };

  const handleDeleteScenario = (scenarioId: string) => {
    const nextScenarios = savedScenarios.filter((scenario) => scenario.id !== scenarioId);
    setSavedScenarios(nextScenarios);
    persistSavedScenarios(nextScenarios);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="mesh-bg absolute inset-0 opacity-40" />
        <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[10%] top-[28rem] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>
      <Navbar />
      <HeroSection />
      <ProcessFlow />
      <InputModule inputs={inputs} liveResults={results} onInputsChange={handleInputsChange} onFocusResults={handleFocusResults} />
      {hasInteracted && (
        <div id="results">
          <Suspense fallback={<SectionFallback copy="Loading saved scenarios..." />}>
            <SavedScenarios
              currentInputs={inputs}
              currentResults={results}
              savedScenarios={savedScenarios}
              onSaveScenario={handleSaveScenario}
              onLoadScenario={handleLoadScenario}
              onDeleteScenario={handleDeleteScenario}
            />
          </Suspense>
          <Suspense fallback={<SectionFallback copy="Loading scenario comparison..." />}>
            <ScenarioComparison currentInputs={inputs} currentResults={results} />
          </Suspense>
          <Suspense fallback={<SectionFallback copy="Loading production analysis..." />}>
            <SimulationDashboard results={results} />
            <FinancialAnalysis results={results} />
          </Suspense>
          <Suspense fallback={<SectionFallback copy="Loading regional analysis..." />}>
            <div className="section-shell">
              <div className="container mx-auto px-6">
                <RegionalViabilityHeatmap inputs={inputs} baselineResults={results} />
              </div>
            </div>
          </Suspense>
        </div>
      )}
      <Suspense fallback={<SectionFallback copy="Loading market intelligence..." />}>
        <MarketIntelligence />
      </Suspense>
      {hasInteracted && (
        <Suspense fallback={<SectionFallback copy="Loading recommendation engine..." />}>
          <AIRecommendation results={results} />
        </Suspense>
      )}
      <Footer />
    </div>
  );
};

export default Index;
