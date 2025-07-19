import { Loader2Icon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="bg-white dark:bg-gray-900 h-screen flex justify-center items-center">
      <Loader2Icon className="w-10 h-10 animate-spin text-gray-700 dark:text-white" />
    </div>
  );
};

export default Loading;
