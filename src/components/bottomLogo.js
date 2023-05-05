import osmo from '.././assets/images/light-osmo.png'

const logo = () => {
    return (
        <div className="bottomLogoContainer">
            <img src={osmo} alt="osmo" className="bottomLogo"/>
        </div>
    );
}

export default logo;