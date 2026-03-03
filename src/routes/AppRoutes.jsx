import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Protected Route
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage';

// Users Management
import UsersListPage from '../pages/users/UsersListPage';
import CreateUserPage from '../pages/users/CreateUserPage';
import EditUserPage from '../pages/users/EditUserPage';

// Templates
import TemplateListPage from '../pages/templates/TemplateListPage';
import TemplateEditorPage from '../pages/templates/TemplateEditorPage';

// Uploads & Mapping
import CsvUploadPage from '../pages/uploads/CsvUploadPage';
import FieldMappingPage from '../pages/uploads/FieldMappingPage';

// Jobs & Generation
import JobsPage from '../pages/jobs/JobsPage';
import GenerationPage from '../pages/jobs/GenerationPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected SaaS Routes (Requires Authentication) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Jobs & Generation (Available to standard users & admins) */}
                    <Route path="/generate" element={<CsvUploadPage />} />
                    <Route path="/uploads/csv" element={<CsvUploadPage />} />
                    <Route path="/uploads/mapping/:jobId" element={<FieldMappingPage />} />
                    <Route path="/jobs/:jobId/generate" element={<GenerationPage />} />
                    <Route path="/jobs" element={<JobsPage />} />

                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'OrganizationAdmin', 'OrgAdmin']} />}>
                        <Route path="/users" element={<UsersListPage />} />
                        <Route path="/users/create" element={<CreateUserPage />} />
                        <Route path="/users/edit/:id" element={<EditUserPage />} />

                        <Route path="/templates" element={<TemplateListPage />} />
                        <Route path="/templates/create" element={<TemplateEditorPage />} />
                        <Route path="/templates/edit/:id" element={<TemplateEditorPage />} />
                    </Route>
                </Route>
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
