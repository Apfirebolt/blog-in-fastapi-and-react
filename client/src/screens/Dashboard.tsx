// components/Dashboard.tsx
import { Card, Typography, Spin, Alert, Empty, Row, Col } from 'antd';
import useDinosaurData from '../hooks/useDinosaurData';
import { useContext } from 'react';
import { UserContext } from '../App';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
    const { dinosaurs, loading, error } = useDinosaurData();
    const { user } = useContext(UserContext);

    console.log('User context:', user);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', fontSize: '1.2em' }}>Loading dinosaurs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ margin: '50px 20px' }}>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={1}>Dinosaur List</Title>
            <Paragraph>
                Here you can find a list of all the dinosaurs available in our database.
                Click on any dinosaur to learn more about it. This uses hooks and reducers in React for state management.
            </Paragraph>
            {dinosaurs.length === 0 ? (
                <Empty description="No dinosaurs found" />
            ) : (
                <Row gutter={[16, 16]}>
                    {dinosaurs.map((dinosaur) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={dinosaur.Name}>
                            <Card title={dinosaur.Name} hoverable>
                                <Paragraph>{dinosaur.Description}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Dashboard;