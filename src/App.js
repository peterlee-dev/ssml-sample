import './App.css';
import axios from 'axios';
import { useRef, useState } from 'react';
const getSSML = data => axios.post('https://lcms.esls.io/frame/common/tts', data).then(({ data }) => data);
const data = [
    {
        title: '김재능 님, 반가워요! 미통과한 학습이 있어요.',
        ssml: `
<speak>
    <emphasis level="strong">김재능 님,</emphasis> 반가워요!
    <break time="300ms"/>
    <emphasis level="moderate">미통과한 학습이 있어요.</emphasis>
</speak>
        `
    },
    {
        title: '나의 아이템을 확인하세요. 별을 모아 별자리를 완성해 보세요!',
        ssml: `
<speak>
    <par>
        <media soundLevel="2dB" fadeInDur="3s" fadeOutDur="3s">
            <audio src="https://t1.daumcdn.net/cfile/tistory/27510D425854D91F34?original"/>
        </media>
        <media>
            <speak>나의 아이템을 확인하세요.
            <break time="500ms"/>
             별을 모아 별자리를 완성해 보세요!</speak>
        </media>
    </par>
</speak>
        `
    },
    {
        title: '정말 훌륭해요!',
        ssml: `
<speak>
    <par>
        <media soundLevel="2dB" fadeOutDur="2s">
            <audio clipEnd="4s" src="https://t1.daumcdn.net/cfile/tistory/9925344A5CF5A16020?original"/>
        </media>
        <media>
            <emphasis level="strong"><prosody pitch="10%">정말 훌륭해요!</prosody></emphasis>
        </media>
    </par>
</speak>
        `
    },
    {
        title: '제트기는 3시간동안 2958km를 날아갔습니다. 1시간동안 몇 km를 날은 셈입니까?',
        ssml: `
<speak>
    <par>
        <media soundLevel="2dB" fadeOutDur="2s">
            <audio src="https://t1.daumcdn.net/cfile/tistory/99D558365CF00A7415?original"/>
        </media>
        <media>
            <speak>
            제트기는 3시간동안 <say-as interpret-as="unit">2958 km
            </say-as>를 날아갔습니다.<break time="300ms"/>
            1시간동안 몇 <sub alias="킬로미터">km</sub>를 날은 셈입니까?</speak>
        </media>
    </par>
</speak>
        `
    }
];
function App() {
    const ref = useRef();
    const formRef = useRef();
    const [audioData, setAudioData] = useState();
    const [loading, setLoading] = useState();
    const [ssmlData, setSsmlData] = useState({
        ssml: ``,
        language: 'ko-KR',
        voiceName: 'ko-KR-Standard-A',
        speakingRate: 1
    });

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        getSSML(ssmlData).then(result => {
            setAudioData(result);
            setLoading(false);
            ref.current.play();
        });
    };
    const handleChange = e => {
        setSsmlData(p => ({ ...p, [e.target.name]: e.target.value }));
    };
    const setSsmlOnly = data => {
        setLoading(true);
        getSSML({ ...ssmlData, ssml: data }).then(result => {
            setAudioData(result);
            setLoading(false);
            setSsmlData({ ...ssmlData, ssml: data });
            ref.current.play();
        });
    };
    const playNormal = text => {
        setLoading(true);
        getSSML({ text, language: 'ko-KR' }).then(result => {
            setAudioData(result);
            setLoading(false);
            ref.current.play();
        });
    };
    return (
        <div className="App" onSubmit={handleSubmit}>
            <div className="container">
                <form ref={formRef}>
                    <div className="row">
                        <div>code</div>
                        <textarea
                            style={{ width: 480, height: 100 }}
                            name="ssml"
                            value={ssmlData.ssml}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="row">
                        voiceName:{' '}
                        <select name="voiceName" value={ssmlData.voiceName} onChange={handleChange}>
                            <option value="ko-KR-Standard-A">ko-KR-Standard-A</option>
                            <option value="ko-KR-Standard-B">ko-KR-Standard-B</option>
                            <option value="ko-KR-Standard-C">ko-KR-Standard-C</option>
                            <option value="ko-KR-Standard-D">ko-KR-Standard-D</option>
                            <option value="ko-KR-Wavenet-A">ko-KR-Wavenet-A</option>
                            <option value="ko-KR-Wavenet-B">ko-KR-Wavenet-B</option>
                            <option value="ko-KR-Wavenet-C">ko-KR-Wavenet-C</option>
                            <option value="ko-KR-Wavenet-D">ko-KR-Wavenet-D</option>
                        </select>
                    </div>
                    <div className="row">
                        speakingRate:{' '}
                        <input name="speakingRate" value={ssmlData.speakingRate} onChange={handleChange}></input>
                    </div>
                    <button type="submit" style={{ marginBottom: '1em' }}>
                        위 정보로 오디오 재생
                    </button>
                </form>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <audio src={audioData} ref={ref} controls></audio>
                    {loading && <span style={{ marginLeft: 20, fontWeight: 'bold' }}>로딩중...</span>}
                </div>
            </div>

            <div>
                {data.map(el => (
                    <div key={el.title} style={{ display: 'flex', alignItems: 'center' }} className="sample-row">
                        <div style={{ width: '350px', border: '1px solid gray', padding: '.25em .5em' }}>
                            {el.title}
                        </div>
                        <div className="btn" onClick={playNormal.bind({}, el.title)}>
                            기존
                        </div>
                        {new RegExp(/audio/).test(el.ssml) && (
                            <div className="btn" onClick={setSsmlOnly.bind({}, el.ssml.replace(/<audio .*>/, ''))}>
                                ssml
                            </div>
                        )}
                        <div className="btn" onClick={setSsmlOnly.bind({}, el.ssml)}>
                            {new RegExp(/audio/).test(el.ssml) ? 'ssml + 배경' : 'ssml'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
