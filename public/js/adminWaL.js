document.querySelector('#waLActivities').addEventListener('change', populatePreview);

async function populatePreview (){
    console.log("populatePreview is running");
    let additionalInfo
    const activity = document.querySelector("#waLActivities").value;
   //console.log('activity');
   //console.log(activity);
   //console.log(typeof(activity))
   if (activity !== ''){
      const response = await fetch("/admin/getAdditionalInfo", {method: 'PUT',
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({activity: activity}),
      });
      const data = await response.json();
      additionalInfo = data.additionalInfo[0];
      console.log(additionalInfo);
      console.log(additionalInfo.videoURL);
    };
    console.log("startPreivew")
    const video = document.querySelector("#reviewVideo");
    video.src=additionalInfo.videoURL;
    if(additionalInfo.videoO === 'v'){
      video.classList.toggle('videoElementV');
    } else if (additionalInfo.videoO === "h") {
      video.classList.toggle('videoElementH');
    } else {
      video.classList.toggle('videoElementS');
    };
    const imageD = document.querySelector("#imageDP");
    imageD.src=additionalInfo.imageDURL;
    const imageDContainer = document.querySelector("#imageDContainer");
    if (additionalInfo.imageDO === 'v'){
      imageDContainer.classList.toggle('imageContainerV');
    } else if (additionalInfo.imageDO === 'h'){
      imageDContainer.classList.toggle('imageContainerH');
    } else {
      imageDContainer.classList.toggle('imageContainerS');
    };
    const audioD = document.querySelector("#audioDP");
    audioD.src=additionalInfo.audioDURL;
    const imageR = document.querySelector("#imageRP");
    imageR.src=additionalInfo.imageRURL;
    const imageRContainer = document.querySelector("#imageRContainer")
    if (additionalInfo.imageRO === 'v'){
      imageRContainer.classList.toggle('imageContainerV');
    } else if (additionalInfo.imageRO === 'h'){
      imageRContainer.classList.toggle('imageContainerH');
    } else {
      imageRContainer.classList.toggle('imageContainerS');
    };const audioR = document.querySelector("#audioRP");
    console.log(audioR);
    audioR.src=additionalInfo.audioRURL; console.log("end Preview")
}