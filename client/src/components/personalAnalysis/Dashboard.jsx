import PersonalAnalysisDashboard from "./dashboard/PersonalAnalysisDashboard";
import { PersonalAnalysisProvider } from "../../context/personalAnalysis/PersonalAnalysisContext";

const dashboard = () => {
  return (
    <PersonalAnalysisProvider>
      <div className="print:hidden"></div>
      <PersonalAnalysisDashboard />
    </PersonalAnalysisProvider>
  );
};
export default dashboard;
