import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Fast Blog ©{new Date().getFullYear()} Created by Amit
        </Footer>
    );
};

export default AppFooter;