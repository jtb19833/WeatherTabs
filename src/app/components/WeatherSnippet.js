

export default function WeatherSnippet(data) {
    data = data.data
    return (
        <div className="flex flex-col items-center w-100 h-150">
            <p>{data.high}°</p>
            <div className="flex flex-row items-center justify-center w-[56px] h-[56px] rounded-lg bg-blue-500">
                <img src={data.icon} alt="Weather Icon" height={48} width={48} ></img>
            </div>
            {data.low!="None"?<p>{data.low}°</p>:<></>}
            <div className="flex flex-row gap-1">
                <img src="/icons/12.png" alt="Precipitation Icon" height={16} width={16}></img>
                <p>{data.precipitation}%</p>
            </div>
            <p className="text-md font-semibold">{data.period}</p>
        </div>
    )   
}