import ApiCrudTest from "@/features/SampleFeature/components/ApiCrudTest"; 

const ApiTestingPage = () => {
  return (
    <>
      <div className="mx-auto flex max-w-[80%] flex-col items-center gap-2 py-32">
        <div>ApiTestingPage</div>

        <ApiCrudTest />
      </div>
    </>
  );
};

export default ApiTestingPage;
