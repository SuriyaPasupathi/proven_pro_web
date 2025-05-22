import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { getProfile } from '../../../store/Services/CreateProfileService';
import ProfileNav from '../ProfileNav';
import { Button } from '@/components/ui/button';

const Verification = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.createProfile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto text-center mt-12 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Verify Your Identity – Just 3 Easy Steps!</h1>
          <p className="text-gray-600 text-lg">Proving your identity helps employers trust you more and feel confident about hiring Filipino workers like you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Government ID */}
          <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center border">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 0A4 4 0 005 15.13M15 11a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Verify with a Government ID <br/>(Required)</h2>
            <div className="text-blue-900 font-semibold mb-2">+50 Proven Proof</div>
            <p className="text-gray-500 text-center mb-6 text-sm">Provide a photo of your valid Government ID and a selfie showing it</p>
            <Button variant="outline" className="w-full">Verify my Identity with Government ID</Button>
          </div>
          {/* Address Validation */}
          <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center border">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v6m0 0H6m6 0h6" /></svg>
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Address Validation<br/>(Choose to Provide)</h2>
            <div className="text-blue-900 font-semibold mb-2">+25 Proven Proof</div>
            <p className="text-gray-500 text-center mb-6 text-sm">Upload a picture of the document showing your billing address</p>
            <Button variant="outline" className="w-full">Validate my address</Button>
          </div>
          {/* Mobile Number */}
          <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center border">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2h8zm-4 18a1 1 0 100-2 1 1 0 000 2z" /></svg>
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Verify Mobile Number<br/>(Choose to Provide)</h2>
            <div className="text-blue-900 font-semibold mb-2">+25 Proven Proof</div>
            <p className="text-gray-500 text-center mb-6 text-sm">Enter your mobile number to receive a verification code</p>
            <Button variant="outline" className="w-full">Validate my mobile number</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
