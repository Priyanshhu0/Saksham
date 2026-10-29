import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface InstitutionRegisterViewProps {
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

export const InstitutionRegisterView: React.FC<InstitutionRegisterViewProps> = ({
  onNavigateHome,
  onNavigateLogin,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [instName, setInstName] = useState('Aryavart Institute of Engineering & Technology');
  const [instCategory, setInstCategory] = useState<'Engineering & Technology' | 'Management' | 'Pharmacy'>('Engineering & Technology');
  const [instType, setInstType] = useState<'Private-Unaided' | 'Government' | 'Govt-Aided'>('Private-Unaided');
  const [region, setRegion] = useState<'Northern' | 'North-Western' | 'Western' | 'Central' | 'Southern'>('Northern');
  const [state, setState] = useState('Uttar Pradesh');
  const [city, setCity] = useState('Lucknow');
  const [address, setAddress] = useState('Plot 42, Knowledge Park, Lucknow 226001');

  // Trust / Society
  const [trustName, setTrustName] = useState('Aryavart Educational & Charitable Society');
  const [regNo, setRegNo] = useState('SOC/UP/2012/894');
  const [estYear, setEstYear] = useState('2012');

  // Principal / Authorized signatory
  const [headName, setHeadName] = useState('Dr. Sanjay Kumar Srivastava');
  const [headEmail, setHeadEmail] = useState('director@aryavart-tech.edu.in');
  const [headPhone, setHeadPhone] = useState('+91 94150 12890');

  const generatedPid = '1-99834102';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#111111] flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 border-b border-[#E5E5E5] bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-medium text-[#777777] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm tracking-tight text-[#111111]">Saksham</span>
          <span className="text-[11px] text-[#777777] border-l border-[#E5E5E5] pl-2.5 hidden sm:inline">
            Institution Onboarding
          </span>
        </div>

        <button
          onClick={onNavigateLogin}
          className="text-xs font-semibold px-3 py-1.5 rounded bg-white hover:bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] transition-colors"
        >
          Already Registered? Sign In
        </button>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 my-auto">
        <div className="bg-white border border-[#E5E5E5] rounded p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Title */}
          <div className="space-y-1 border-b border-[#E5E5E5] pb-4">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEEEEC] text-[#111111] border border-[#E5E5E5] uppercase font-semibold">
              APH 2026-27 Procedure
            </span>
            <h2 className="text-xl font-bold text-[#111111] mt-2">
              New Technical Institution Registration
            </h2>
            <p className="text-xs text-[#777777]">
              Register sponsoring Trust/Society and generate Permanent Institute ID (PID) for AICTE approval cycles.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-xs border-b border-[#E5E5E5] pb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`font-semibold flex items-center gap-2 ${step >= 1 ? 'text-[#111111]' : 'text-[#777777]'}`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step === 1 ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] bg-[#EEEEEC] text-[#111111]'}`}>
                    1
                  </span>
                  <span>Institution Identity</span>
                </button>
                <span className="text-[#E5E5E5]">•</span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`font-semibold flex items-center gap-2 ${step >= 2 ? 'text-[#111111]' : 'text-[#777777]'}`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step === 2 ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] bg-[#EEEEEC] text-[#111111]'}`}>
                    2
                  </span>
                  <span>Sponsoring Trust</span>
                </button>
                <span className="text-[#E5E5E5]">•</span>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`font-semibold flex items-center gap-2 ${step >= 3 ? 'text-[#111111]' : 'text-[#777777]'}`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${step === 3 ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#E5E5E5] bg-[#EEEEEC] text-[#111111]'}`}>
                    3
                  </span>
                  <span>Head of Institution</span>
                </button>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Proposed Institution Name
                    </label>
                    <input
                      type="text"
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Discipline / Category
                      </label>
                      <select
                        value={instCategory}
                        onChange={(e) => setInstCategory(e.target.value as any)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      >
                        <option value="Engineering & Technology">Engineering & Technology</option>
                        <option value="Management">Management (MBA/PGDM)</option>
                        <option value="Pharmacy">Pharmacy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Institution Type
                      </label>
                      <select
                        value={instType}
                        onChange={(e) => setInstType(e.target.value as any)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      >
                        <option value="Private-Unaided">Private-Unaided</option>
                        <option value="Govt-Aided">Govt-Aided</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        AICTE Region
                      </label>
                      <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value as any)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      >
                        <option value="Northern">Northern (NRO Kanpur)</option>
                        <option value="North-Western">North-Western (NWRO)</option>
                        <option value="Western">Western (WRO)</option>
                        <option value="Central">Central (CRO)</option>
                        <option value="Southern">Southern (SRO)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Campus Physical Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Proceed to Trust Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Sponsoring Body / Trust / Society Name
                    </label>
                    <input
                      type="text"
                      value={trustName}
                      onChange={(e) => setTrustName(e.target.value)}
                      className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Registration Act & Number
                      </label>
                      <input
                        type="text"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Year of Registration
                      </label>
                      <input
                        type="text"
                        value={estYear}
                        onChange={(e) => setEstYear(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded bg-white border border-[#E5E5E5] text-[#777777] hover:text-[#111111] text-xs transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Head of Institution</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Principal / Director / Head Name
                    </label>
                    <input
                      type="text"
                      value={headName}
                      onChange={(e) => setHeadName(e.target.value)}
                      className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Official Contact Email
                      </label>
                      <input
                        type="email"
                        value={headEmail}
                        onChange={(e) => setHeadEmail(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={headPhone}
                        onChange={(e) => setHeadPhone(e.target.value)}
                        className="w-full h-10 px-3 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs focus:outline-none focus:border-[#111111]"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#F7F7F5] border border-[#E5E5E5] text-[11px] text-[#777777]">
                    <span>By submitting this onboarding request, the authorized representative undertakes that all statutory documents (Land Lease deed, Safety certificate, Fire NOC) are available for verification.</span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded bg-white border border-[#E5E5E5] text-[#777777] hover:text-[#111111] text-xs transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Generate Permanent ID & Register</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Registration Success Card */
            <div className="p-6 rounded bg-[#F7F7F5] border border-[#E5E5E5] space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111111]">
                  Institutional Record Registered Successfully
                </h3>
                <p className="text-xs text-[#777777]">
                  Permanent Institute ID (PID) has been generated in the AICTE National Database.
                </p>
              </div>

              <div className="p-4 rounded bg-white border border-[#E5E5E5] max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Permanent Institute ID:</span>
                  <span className="font-mono font-bold text-[#111111]">{generatedPid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Institution:</span>
                  <span className="font-medium text-right text-[#111111]">{instName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Region:</span>
                  <span className="text-[#111111]">{region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Status:</span>
                  <span className="text-[#111111] font-medium">Active Demonstration Record</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={onNavigateLogin}
                  className="px-5 py-2.5 rounded bg-[#111111] hover:bg-[#222222] text-white font-medium text-xs transition-colors"
                >
                  Proceed to Sign In & Submit Application
                </button>
                <button
                  onClick={onNavigateHome}
                  className="px-4 py-2.5 rounded bg-white border border-[#E5E5E5] text-[#111111] text-xs transition-colors hover:bg-[#EEEEEC]"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
