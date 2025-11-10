import React from 'react';
import { Form, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const DescriptionTextarea = ({ postData, handleChangeInput, placeholder }) => {
    const { t, i18n } = useTranslation(["categories"]);
    
    return (
        <Card>
            <Card.Header >
                <h5 className="mb-0">
                    📝 {t('description', 'Descripción')}
                </h5>
            </Card.Header>
            <Card.Body className="p-3">
                <Form.Group className="w-100">
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={postData.description || ''}
                        onChange={handleChangeInput}
                        placeholder={placeholder || t('placeholderDescription', 'Escriba una descripción detallada...')}
                        required
                        className="w-100"
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default DescriptionTextarea;