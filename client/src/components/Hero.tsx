import React, { useEffect } from 'react';
import { Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

interface HeroProps {
  randomNumber: number;
}

const Hero: React.FC<HeroProps> = (props) => {
    const { randomNumber } = props;

    console.log("Random Number:", randomNumber);

    useEffect(() => {
        // This effect can be used to perform side effects related to the random number
        console.log("Hero component mounted with random number:", randomNumber);
    }, [])

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            padding: '1rem',
            textAlign: 'center',
            color: 'white'
        }}>
            <Space direction="vertical" size="large">
                <Title level={1} style={{ color: 'white', margin: 0 }}>
                    Welcome to Dino World
                </Title>
                <img
                    src="https://musicart.xboxlive.com/7/ac6d5100-0000-0000-0000-000000000002/504/image.jpg"
                    alt="Dinosaur"
                    style={{ width: "100%", maxHeight: "300px", objectFit: "cover", marginBottom: "20px" }}
                />
                <Paragraph style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                    Discover the fascinating world of dinosaurs! Click the button below to learn more about a random dinosaur.
                </Paragraph>
            </Space>
        </div>
    );
};

export default Hero;