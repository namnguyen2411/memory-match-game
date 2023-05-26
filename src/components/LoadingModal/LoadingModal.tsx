import { memo } from 'react';
import loading_indicator from '../../assets/images/loading_indicator.svg';

export default memo(function LoadingModal() {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-slate300 backdrop-blur-[1px]">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black p-10 font-bold text-white">
        <div className="grid place-items-center text-center">
          <div>
            <img src={loading_indicator} alt="loading indicator" />
          </div>
          <p className="mt-10">Loading data</p>
        </div>
      </div>
    </div>
  );
});
