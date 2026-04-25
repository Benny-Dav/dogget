import FeatureCards from "./FeatureCards";

const TrustSection = () => {
    return (
        <section className='py-4 px-6'>
            <h2 className='text-gray-900 text-2xl font-bold text-center mb-2'>Why choose Dogget?</h2>
            <p className='text-center text-sm text-gray-500 mb-4'>Everything your pup needs, done right.</p>
            <FeatureCards/>
        </section>
    )
}

export default TrustSection;
