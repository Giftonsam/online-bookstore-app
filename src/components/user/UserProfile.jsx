import React, { useState, useRef, useEffect } from 'react'
import {
    User,
    Edit,
    Save,
    X,
    Mail,
    Phone,
    MapPin,
    Package,
    AlertCircle,
    CheckCircle,
    Camera,
    Upload,
    Download,
    Eye,
    EyeOff,
    Calendar,
    Shield,
    Bell,
    Settings,
    Trash2,
    Lock,
    Globe,
    Users,
    Key,
    RefreshCw,
    Info,
    Star,
    Award,
    Activity,
    Heart,
    BookOpen,
    ShoppingCart,
    TrendingUp,
    Clock,
    Filter,
    Search
} from 'lucide-react'

// Mock data for demonstration
const mockUser = {
    id: 1,
    firstname: 'Shashi',
    lastname: 'Raj',
    email: 'shashi@bookstore.com',
    phone: '9876543210',
    address: 'User Address',
    profileImage: null,
    dateOfBirth: '1990-01-01',
    bio: 'Book lover and avid reader',
    createdAt: '2024-01-01',
    accountType: 'Premium',
    loyaltyPoints: 1250,
    favoriteGenres: ['Fiction', 'Mystery', 'Science'],
    lastActive: '2024-08-19T10:30:00Z',
    privacySettings: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showAddress: false,
        showOrderHistory: false
    },
    notificationSettings: {
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotions: true,
        newsletter: false,
        bookRecommendations: true,
        priceAlerts: false
    },
    securitySettings: {
        twoFactorEnabled: false,
        loginAlerts: true,
        passwordLastChanged: '2024-07-15'
    }
}

const mockOrders = [
    {
        id: 1001,
        userId: 1,
        status: 'delivered',
        orderDate: '2024-08-10',
        deliveryDate: '2024-08-13',
        totalAmount: 1250,
        items: [{ name: 'The Great Gatsby', price: 650 }, { name: 'To Kill a Mockingbird', price: 600 }],
        rating: 5
    },
    {
        id: 1002,
        userId: 1,
        status: 'shipped',
        orderDate: '2024-08-15',
        estimatedDelivery: '2024-08-20',
        totalAmount: 890,
        items: [{ name: 'Atomic Habits', price: 890 }],
        trackingNumber: 'TRK123456789'
    },
    {
        id: 1003,
        userId: 1,
        status: 'processing',
        orderDate: '2024-08-18',
        totalAmount: 1540,
        items: [{ name: 'Sapiens', price: 750 }, { name: 'Educated', price: 790 }]
    }
]

const mockWishlist = [
    { id: 1, name: 'Dune', author: 'Frank Herbert', price: 899 },
    { id: 2, name: '1984', author: 'George Orwell', price: 650 },
    { id: 3, name: 'The Alchemist', author: 'Paulo Coelho', price: 550 }
]

export default function UserProfile() {
    const [user] = useState(mockUser)
    const [orders] = useState(mockOrders)
    const [wishlist] = useState(mockWishlist)
    const fileInputRef = useRef(null)

    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')
    const [showImageOptions, setShowImageOptions] = useState(false)
    const [showPrivacySettings, setShowPrivacySettings] = useState(false)
    const [showNotificationSettings, setShowNotificationSettings] = useState(false)
    const [showSecuritySettings, setShowSecuritySettings] = useState(false)
    const [activeTab, setActiveTab] = useState('recent')
    const [orderFilter, setOrderFilter] = useState('all')

    const [formData, setFormData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        profileImage: user?.profileImage || null,
        dateOfBirth: user?.dateOfBirth || '',
        bio: user?.bio || '',
        favoriteGenres: user?.favoriteGenres || []
    })

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: user?.privacySettings?.profileVisibility || 'public',
        showEmail: user?.privacySettings?.showEmail || false,
        showPhone: user?.privacySettings?.showPhone || false,
        showAddress: user?.privacySettings?.showAddress || false,
        showOrderHistory: user?.privacySettings?.showOrderHistory || false
    })

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: user?.notificationSettings?.emailNotifications || true,
        smsNotifications: user?.notificationSettings?.smsNotifications || false,
        orderUpdates: user?.notificationSettings?.orderUpdates || true,
        promotions: user?.notificationSettings?.promotions || true,
        newsletter: user?.notificationSettings?.newsletter || false,
        bookRecommendations: user?.notificationSettings?.bookRecommendations || true,
        priceAlerts: user?.notificationSettings?.priceAlerts || false
    })

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorEnabled: user?.securitySettings?.twoFactorEnabled || false,
        loginAlerts: user?.securitySettings?.loginAlerts || true
    })

    const userOrders = orders.filter(order => order.userId === user?.id)
    const filteredOrders = orderFilter === 'all' ? userOrders : userOrders.filter(order => order.status === orderFilter)
    const recentOrders = userOrders.slice(0, 3)

    // Close image options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showImageOptions && !event.target.closest('.profile-avatar-container')) {
                setShowImageOptions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showImageOptions])

    const updateProfile = async (data) => {
        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true })
            }, 1000)
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePrivacyChange = (setting) => {
        setPrivacySettings(prev => ({
            ...prev,
            [setting]: setting === 'profileVisibility' ? 
                (prev[setting] === 'public' ? 'private' : prev[setting] === 'private' ? 'friends' : 'public') :
                !prev[setting]
        }))
    }

    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }))
    }

    const handleSecurityChange = (setting) => {
        setSecuritySettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }))
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB')
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }))
                setShowImageOptions(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            profileImage: null
        }))
        setShowImageOptions(false)
    }

    const downloadProfileData = () => {
        const profileData = {
            personalInfo: formData,
            orders: userOrders,
            privacySettings,
            notificationSettings,
            securitySettings,
            wishlist,
            accountStats: {
                totalOrders: userOrders.length,
                totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
                memberSince: calculateMemberSince(),
                profileCompletion: calculateProfileCompletion(),
                loyaltyPoints: user?.loyaltyPoints,
                accountType: user?.accountType
            },
            exportDate: new Date().toISOString()
        }

        const dataStr = JSON.stringify(profileData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = `profile_data_${user?.firstname}_${user?.lastname}_${new Date().toISOString().split('T')[0]}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    const handleEdit = () => {
        setIsEditing(true)
        setUpdateMessage('')
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
            profileImage: user?.profileImage || null,
            dateOfBirth: user?.dateOfBirth || '',
            bio: user?.bio || '',
            favoriteGenres: user?.favoriteGenres || []
        })
        setUpdateMessage('')
        setShowImageOptions(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsUpdating(true)

        const updatedData = {
            ...formData,
            privacySettings,
            notificationSettings,
            securitySettings
        }

        try {
            const result = await updateProfile(updatedData)

            if (result.success) {
                setIsEditing(false)
                setUpdateMessage('Profile updated successfully!')
                setTimeout(() => setUpdateMessage(''), 3000)
            } else {
                setUpdateMessage('Failed to update profile. Please try again.')
                setTimeout(() => setUpdateMessage(''), 3000)
            }
        } catch (error) {
            setUpdateMessage('An error occurred while updating profile.')
            setTimeout(() => setUpdateMessage(''), 3000)
        }

        setIsUpdating(false)
    }

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning'
            case 'processing': return 'info'
            case 'shipped': return 'primary'
            case 'delivered': return 'success'
            case 'cancelled': return 'danger'
            default: return 'primary'
        }
    }

    const calculateMemberSince = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).getFullYear()
        }
        return new Date().getFullYear() - 1 // Placeholder
    }

    const calculateProfileCompletion = () => {
        const fields = Object.values(formData)
        const filledFields = fields.filter(val => val && val !== '').length
        return Math.round((filledFields / fields.length) * 100)
    }

    const getInitials = (firstname, lastname) => {
        return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase()
    }

    const getVisibilityIcon = (visibility) => {
        switch (visibility) {
            case 'public': return Globe
            case 'private': return Lock
            case 'friends': return Users
            default: return Globe
        }
    }

    const formatLastActive = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'Active now'
        if (diffInHours < 24) return `Active ${diffInHours}h ago`
        const diffInDays = Math.floor(diffInHours / 24)
        return `Active ${diffInDays}d ago`
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page__header">
                    <div>
                        <h1 className="page__title">My Profile</h1>
                        <p className="page__subtitle">Manage your account information and preferences</p>
                    </div>
                    <div className="profile-actions">
                        <button
                            onClick={downloadProfileData}
                            className="btn btn--outline btn--sm"
                            title="Download Profile Data"
                        >
                            <Download size={16} />
                            Export Data
                        </button>
                        {user?.accountType === 'Premium' && (
                            <div className="premium-badge">
                                <Award size={16} />
                                Premium
                            </div>
                        )}
                    </div>
                </div>

                {updateMessage && (
                    <div className={`alert ${updateMessage.includes('success') ? 'alert--success' : 'alert--error'}`}>
                        <CheckCircle size={20} />
                        {updateMessage}
                    </div>
                )}

                <div className="profile-layout">
                    {/* Profile Information */}
                    <div className="profile-section">
                        <div className="card profile-card">
                            <div className="card__header">
                                <h2 className="section-title">Personal Information</h2>
                                {!isEditing ? (
                                    <button onClick={handleEdit} className="btn btn--primary btn--sm">
                                        <Edit size={16} />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="edit-actions">
                                        <button
                                            onClick={handleCancel}
                                            className="btn btn--outline btn--sm"
                                            disabled={isUpdating}
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="card__body">
                                {!isEditing ? (
                                    <div className="profile-info">
                                        <div className="profile-avatar-container">
                                            <div className="profile-avatar">
                                                {formData.profileImage ? (
                                                    <img
                                                        src={formData.profileImage}
                                                        alt="Profile"
                                                        className="profile-image"
                                                    />
                                                ) : (
                                                    <div className="profile-initials">
                                                        {getInitials(user?.firstname, user?.lastname) || <User size={48} />}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="avatar-edit-btn"
                                                onClick={() => setShowImageOptions(!showImageOptions)}
                                                title="Change Profile Picture"
                                            >
                                                <Camera size={16} />
                                            </button>

                                            {showImageOptions && (
                                                <div className="image-options">
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="image-option"
                                                    >
                                                        <Upload size={16} />
                                                        Upload Photo
                                                    </button>
                                                    {formData.profileImage && (
                                                        <button
                                                            onClick={handleRemoveImage}
                                                            className="image-option image-option--danger"
                                                        >
                                                            <Trash2 size={16} />
                                                            Remove Photo
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                        />

                                        <div className="profile-details">
                                            <div className="profile-header">
                                                <h3 className="profile-name">
                                                    {user?.firstname} {user?.lastname}
                                                </h3>
                                                <div className="profile-status">
                                                    <Activity size={12} />
                                                    <span>{formatLastActive(user?.lastActive)}</span>
                                                </div>
                                            </div>
                                            {formData.bio && (
                                                <p className="profile-bio">{formData.bio}</p>
                                            )}
                                            {user?.favoriteGenres && user.favoriteGenres.length > 0 && (
                                                <div className="favorite-genres">
                                                    <BookOpen size={14} />
                                                    <span>Loves: {user.favoriteGenres.join(', ')}</span>
                                                </div>
                                            )}
                                            <div className="profile-contact">
                                                <div className="contact-item">
                                                    <Mail size={16} />
                                                    <span>
                                                        {privacySettings.showEmail ? user?.email : '••••••@••••••.com'}
                                                    </span>
                                                    <button
                                                        className="privacy-toggle"
                                                        onClick={() => handlePrivacyChange('showEmail')}
                                                        title={privacySettings.showEmail ? "Visible to public - click to hide" : "Hidden from public - click to show"}
                                                    >
                                                        {privacySettings.showEmail ? <Eye size={12} /> : <EyeOff size={12} />}
                                                    </button>
                                                </div>

                                                {user?.phone && (
                                                    <div className="contact-item">
                                                        <Phone size={16} />
                                                        <span>
                                                            {privacySettings.showPhone ? user?.phone : '••••••••••'}
                                                        </span>
                                                        <button
                                                            className="privacy-toggle"
                                                            onClick={() => handlePrivacyChange('showPhone')}
                                                            title={privacySettings.showPhone ? "Visible to public - click to hide" : "Hidden from public - click to show"}
                                                        >
                                                            {privacySettings.showPhone ? <Eye size={12} /> : <EyeOff size={12} />}
                                                        </button>
                                                    </div>
                                                )}

                                                {user?.address && (
                                                    <div className="contact-item">
                                                        <MapPin size={16} />
                                                        <span>
                                                            {privacySettings.showAddress ? user?.address : '•••• ••••••• ••••••'}
                                                        </span>
                                                        <button
                                                            className="privacy-toggle"
                                                            onClick={() => handlePrivacyChange('showAddress')}
                                                            title={privacySettings.showAddress ? "Visible to public - click to hide" : "Hidden from public - click to show"}
                                                        >
                                                            {privacySettings.showAddress ? <Eye size={12} /> : <EyeOff size={12} />}
                                                        </button>
                                                    </div>
                                                )}

                                                {formData.dateOfBirth && (
                                                    <div className="contact-item">
                                                        <Calendar size={16} />
                                                        <span>{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSave} className="profile-form">
                                        {/* Profile Image Section */}
                                        <div className="form-group">
                                            <label className="form-label">Profile Picture</label>
                                            <div className="profile-image-upload">
                                                <div className="profile-avatar">
                                                    {formData.profileImage ? (
                                                        <img
                                                            src={formData.profileImage}
                                                            alt="Profile"
                                                            className="profile-image"
                                                        />
                                                    ) : (
                                                        <div className="profile-initials">
                                                            {getInitials(formData.firstname, formData.lastname) || <User size={48} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="image-upload-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="btn btn--outline btn--sm"
                                                    >
                                                        <Upload size={16} />
                                                        {formData.profileImage ? 'Change' : 'Upload'} Photo
                                                    </button>
                                                    {formData.profileImage && (
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveImage}
                                                            className="btn btn--outline btn--sm btn--danger"
                                                        >
                                                            <Trash2 size={16} />
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <p className="form-help-text">
                                                Upload a profile picture (max 5MB). Supported formats: JPG, PNG, GIF
                                            </p>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="firstname" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstname"
                                                    name="firstname"
                                                    value={formData.firstname}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastname"
                                                    name="lastname"
                                                    value={formData.lastname}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="phone" className="form-label">Phone</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    id="dateOfBirth"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <textarea
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="form-input"
                                                rows="3"
                                                placeholder="Enter your full address..."
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="bio" className="form-label">Bio</label>
                                            <textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                className="form-input"
                                                rows="2"
                                                placeholder="Tell us about yourself..."
                                                maxLength="200"
                                            />
                                            <p className="form-help-text">
                                                {formData.bio.length}/200 characters
                                            </p>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className="btn btn--primary"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <div className="spinner spinner--sm"></div>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Privacy Settings */}
                        <div className="card settings-card">
                            <div className="card__header">
                                <h2 className="section-title">Privacy Settings</h2>
                                <button
                                    onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                                    className={`btn btn--sm ${showPrivacySettings ? 'btn--primary' : 'btn--outline'}`}
                                >
                                    <Shield size={16} />
                                    {showPrivacySettings ? 'Hide' : 'Show'} Settings
                                </button>
                            </div>

                            {showPrivacySettings && (
                                <div className="card__body">
                                    <div className="settings-section">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <span className="setting-title">Profile Visibility</span>
                                                <span className="setting-description">Control who can see your profile</span>
                                            </div>
                                            <button
                                                onClick={() => handlePrivacyChange('profileVisibility')}
                                                className="visibility-toggle"
                                                title={`Currently ${privacySettings.profileVisibility} - click to change`}
                                            >
                                                {React.createElement(getVisibilityIcon(privacySettings.profileVisibility), { size: 16 })}
                                                <span>{privacySettings.profileVisibility}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showEmail}
                                                    onChange={() => handlePrivacyChange('showEmail')}
                                                    className="setting-checkbox"
                                                />
                                                <span>Show email publicly</span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showPhone}
                                                    onChange={() => handlePrivacyChange('showPhone')}
                                                    className="setting-checkbox"
                                                />
                                                <span>Show phone publicly</span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showAddress}
                                                    onChange={() => handlePrivacyChange('showAddress')}
                                                    className="setting-checkbox"
                                                />
                                                <span>Show address publicly</span>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings.showOrderHistory}
                                                    onChange={() => handlePrivacyChange('showOrderHistory')}
                                                    className="setting-checkbox"
                                                />
                                                <span>Show order history publicly</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notification Settings */}
                        <div className="card settings-card">
                            <div className="card__header">
                                <h2 className="section-title">Notification Preferences</h2>
                                <button
                                    onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                                    className={`btn btn--sm ${showNotificationSettings ? 'btn--primary' : 'btn--outline'}`}
                                >
                                    <Bell size={16} />
                                    {showNotificationSettings ? 'Hide' : 'Show'} Settings
                                </button>
                            </div>

                            {showNotificationSettings && (
                                <div className="card__body">
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.emailNotifications}
                                                    onChange={() => handleNotificationChange('emailNotifications')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Email notifications</span>
                                                    <span className="setting-description">Receive general updates via email</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.smsNotifications}
                                                    onChange={() => handleNotificationChange('smsNotifications')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>SMS notifications</span>
                                                    <span className="setting-description">Receive urgent updates via SMS</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.orderUpdates}
                                                    onChange={() => handleNotificationChange('orderUpdates')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Order updates</span>
                                                    <span className="setting-description">Track your order status and delivery</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.promotions}
                                                    onChange={() => handleNotificationChange('promotions')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Promotional offers</span>
                                                    <span className="setting-description">Get notified about sales and discounts</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.newsletter}
                                                    onChange={() => handleNotificationChange('newsletter')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Newsletter subscription</span>
                                                    <span className="setting-description">Weekly book recommendations and news</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.bookRecommendations}
                                                    onChange={() => handleNotificationChange('bookRecommendations')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Book recommendations</span>
                                                    <span className="setting-description">Personalized book suggestions based on your preferences</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.priceAlerts}
                                                    onChange={() => handleNotificationChange('priceAlerts')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Price alerts</span>
                                                    <span className="setting-description">Get notified when wishlist items go on sale</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security Settings */}
                        <div className="card settings-card">
                            <div className="card__header">
                                <h2 className="section-title">Security Settings</h2>
                                <button
                                    onClick={() => setShowSecuritySettings(!showSecuritySettings)}
                                    className={`btn btn--sm ${showSecuritySettings ? 'btn--primary' : 'btn--outline'}`}
                                >
                                    <Key size={16} />
                                    {showSecuritySettings ? 'Hide' : 'Show'} Settings
                                </button>
                            </div>

                            {showSecuritySettings && (
                                <div className="card__body">
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.twoFactorEnabled}
                                                    onChange={() => handleSecurityChange('twoFactorEnabled')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Two-Factor Authentication</span>
                                                    <span className="setting-description">Add an extra layer of security to your account</span>
                                                </div>
                                            </label>
                                            {securitySettings.twoFactorEnabled && (
                                                <button className="btn btn--outline btn--xs">
                                                    <Settings size={14} />
                                                    Configure
                                                </button>
                                            )}
                                        </div>
                                        <div className="setting-item">
                                            <label className="setting-label">
                                                <input
                                                    type="checkbox"
                                                    checked={securitySettings.loginAlerts}
                                                    onChange={() => handleSecurityChange('loginAlerts')}
                                                    className="setting-checkbox"
                                                />
                                                <div className="setting-text">
                                                    <span>Login alerts</span>
                                                    <span className="setting-description">Get notified of suspicious login attempts</span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="security-info">
                                            <div className="security-item">
                                                <span className="security-label">Password last changed:</span>
                                                <span className="security-value">
                                                    {new Date(user?.securitySettings?.passwordLastChanged).toLocaleDateString()}
                                                </span>
                                                <button className="btn btn--outline btn--xs">
                                                    <RefreshCw size={14} />
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="profile-sidebar">
                        {/* Quick Stats */}
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Quick Stats</h2>
                            </div>
                            <div className="card__body">
                                <div className="quick-stats">
                                    <div className="stat-card">
                                        <div className="stat-icon stat-icon--primary">
                                            <ShoppingCart size={20} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">{userOrders.length}</span>
                                            <span className="stat-label">Total Orders</span>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon stat-icon--success">
                                            <Star size={20} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">{user?.loyaltyPoints}</span>
                                            <span className="stat-label">Loyalty Points</span>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon stat-icon--warning">
                                            <Heart size={20} />
                                        </div>
                                        <div className="stat-info">
                                            <span className="stat-number">{wishlist.length}</span>
                                            <span className="stat-label">Wishlist Items</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History Summary */}
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Order History</h2>
                                <div className="order-tabs">
                                    <button
                                        onClick={() => setActiveTab('recent')}
                                        className={`tab-btn ${activeTab === 'recent' ? 'tab-btn--active' : ''}`}
                                    >
                                        Recent
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`tab-btn ${activeTab === 'all' ? 'tab-btn--active' : ''}`}
                                    >
                                        All Orders
                                    </button>
                                </div>
                            </div>

                            <div className="card__body">
                                {!privacySettings.showOrderHistory ? (
                                    <div className="no-orders">
                                        <Package size={32} />
                                        <p>Order history is private</p>
                                        <button
                                            className="btn btn--primary btn--sm"
                                            onClick={() => handlePrivacyChange('showOrderHistory')}
                                        >
                                            Make Public
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === 'all' && (
                                            <div className="order-filters">
                                                <select
                                                    value={orderFilter}
                                                    onChange={(e) => setOrderFilter(e.target.value)}
                                                    className="filter-select"
                                                >
                                                    <option value="all">All Status</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="pending">Pending</option>
                                                </select>
                                            </div>
                                        )}
                                        
                                        <div className="orders-list">
                                            {(activeTab === 'recent' ? recentOrders : filteredOrders).map(order => (
                                                <div key={order.id} className="order-item">
                                                    <div className="order-header">
                                                        <span className="order-id">Order #{order.id}</span>
                                                        <span className={`badge badge--${getOrderStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="order-details">
                                                        <div className="order-meta">
                                                            <span className="order-date">
                                                                <Clock size={12} />
                                                                {new Date(order.orderDate).toLocaleDateString()}
                                                            </span>
                                                            <span className="order-total">
                                                                <TrendingUp size={12} />
                                                                ₹{order.totalAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="order-items-count">
                                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                        </div>
                                                        {order.trackingNumber && (
                                                            <div className="tracking-info">
                                                                <span className="tracking-label">Tracking:</span>
                                                                <span className="tracking-number">{order.trackingNumber}</span>
                                                            </div>
                                                        )}
                                                        {order.rating && (
                                                            <div className="order-rating">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={12}
                                                                        className={i < order.rating ? 'star-filled' : 'star-empty'}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {activeTab === 'recent' && userOrders.length > 3 && (
                                            <button
                                                onClick={() => setActiveTab('all')}
                                                className="btn btn--outline btn--sm view-all-btn"
                                            >
                                                View All {userOrders.length} Orders
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Wishlist Preview */}
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Wishlist</h2>
                                <span className="section-count">{wishlist.length} items</span>
                            </div>
                            <div className="card__body">
                                {wishlist.length > 0 ? (
                                    <div className="wishlist-preview">
                                        {wishlist.slice(0, 3).map(item => (
                                            <div key={item.id} className="wishlist-item">
                                                <div className="wishlist-info">
                                                    <span className="wishlist-title">{item.name}</span>
                                                    <span className="wishlist-author">{item.author}</span>
                                                </div>
                                                <span className="wishlist-price">₹{item.price}</span>
                                            </div>
                                        ))}
                                        {wishlist.length > 3 && (
                                            <button className="btn btn--outline btn--sm view-all-btn">
                                                View All Wishlist Items
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-orders">
                                        <Heart size={32} />
                                        <p>No items in wishlist</p>
                                        <button className="btn btn--primary btn--sm">
                                            Browse Books
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Statistics */}
                        <div className="card">
                            <div className="card__header">
                                <h2 className="section-title">Account Overview</h2>
                            </div>
                            <div className="card__body">
                                <div className="stats-list">
                                    <div className="stat-item">
                                        <span className="stat-label">Total Spent:</span>
                                        <span className="stat-value stat-value--highlight">
                                            ₹{userOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Member Since:</span>
                                        <span className="stat-value">
                                            {calculateMemberSince()}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Profile Completion:</span>
                                        <div className="completion-bar">
                                            <div 
                                                className="completion-fill" 
                                                style={{width: `${calculateProfileCompletion()}%`}}
                                            ></div>
                                            <span className="completion-text">{calculateProfileCompletion()}%</span>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Account Status:</span>
                                        <span className={`status-badge ${user?.accountType === 'Premium' ? 'status-badge--premium' : 'status-badge--regular'}`}>
                                            {user?.accountType === 'Premium' && <Award size={14} />}
                                            {user?.accountType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        /* CSS Variables for Light and Dark Theme */
        :root {
          --color-primary: #3b82f6;
          --color-primary-dark: #2563eb;
          --color-primary-light: #dbeafe;
          --color-secondary: #10b981;
          --color-danger: #ef4444;
          --color-danger-dark: #dc2626;
          --color-danger-light: #fecaca;
          --color-warning: #f59e0b;
          --color-warning-dark: #d97706;
          --color-warning-light: #fef3c7;
          --color-success: #10b981;
          --color-success-dark: #059669;
          --color-success-light: #d1fae5;
          --color-info: #06b6d4;
          --color-info-dark: #0891b2;
          --color-info-light: #cffafe;
          --color-gray-200: #e5e7eb;
          --color-gray-300: #d1d5db;
          
          /* Light theme colors */
          --bg-primary: #ffffff;
          --bg-secondary: #f9fafb;
          --bg-tertiary: #f3f4f6;
          --text-primary: #111827;
          --text-secondary: #6b7280;
          --text-muted: #9ca3af;
          --border-color: #e5e7eb;
          --shadow-color: rgba(0, 0, 0, 0.1);
          --shadow-hover: rgba(0, 0, 0, 0.15);
          
          /* Spacing */
          --space-1: 0.25rem;
          --space-2: 0.5rem;
          --space-3: 0.75rem;
          --space-4: 1rem;
          --space-5: 1.25rem;
          --space-6: 1.5rem;
          --space-8: 2rem;
          --space-10: 2.5rem;
          
          /* Typography */
          --font-size-xs: 0.75rem;
          --font-size-sm: 0.875rem;
          --font-size-base: 1rem;
          --font-size-lg: 1.125rem;
          --font-size-xl: 1.25rem;
          --font-size-2xl: 1.5rem;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          
          /* Border radius */
          --radius-sm: 0.25rem;
          --radius-md: 0.375rem;
          --radius-lg: 0.5rem;
          --radius-xl: 0.75rem;
          --radius-full: 9999px;
          
          /* Transitions */
          --transition-fast: 150ms ease-in-out;
          --transition-medium: 250ms ease-in-out;
        }

        /* Dark theme detection */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-primary: #1f2937;
            --bg-secondary: #111827;
            --bg-tertiary: #374151;
            --text-primary: #f9fafb;
            --text-secondary: #d1d5db;
            --text-muted: #9ca3af;
            --border-color: #374151;
            --shadow-color: rgba(0, 0, 0, 0.3);
            --shadow-hover: rgba(0, 0, 0, 0.4);
            --color-gray-200: #4b5563;
            --color-gray-300: #6b7280;
          }
        }

        /* Manual dark theme class for testing */
        .dark {
          --bg-primary: #1f2937;
          --bg-secondary: #111827;
          --bg-tertiary: #374151;
          --text-primary: #f9fafb;
          --text-secondary: #d1d5db;
          --text-muted: #9ca3af;
          --border-color: #374151;
          --shadow-color: rgba(0, 0, 0, 0.3);
          --shadow-hover: rgba(0, 0, 0, 0.4);
          --color-gray-200: #4b5563;
          --color-gray-300: #6b7280;
        }

        .page {
          min-height: 100vh;
          background: var(--bg-secondary);
          color: var(--text-primary);
          padding: var(--space-6);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page__title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin: 0 0 var(--space-2) 0;
          color: var(--text-primary);
        }

        .page__subtitle {
          color: var(--text-secondary);
          margin: 0;
        }

        .page__header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: var(--space-8);
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-8);
          align-items: start;
        }

        .profile-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .profile-sidebar {
          position: sticky;
          top: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .profile-actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .premium-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0;
          color: var(--text-primary);
        }

        .section-count {
          font-size: var(--font-size-sm);
          color: var(--text-muted);
          background: var(--bg-tertiary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
        }

        .section-link {
          color: var(--color-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .section-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .edit-actions {
          display: flex;
          gap: var(--space-2);
        }

        .profile-info {
          display: flex;
          gap: var(--space-6);
          align-items: start;
        }

        .profile-avatar-container {
          position: relative;
        }

        .profile-avatar {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          width: 80px;
          height: 80px;
        }

        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-full);
        }

        .profile-initials {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-primary-dark);
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 4px var(--shadow-color);
          transition: all var(--transition-fast);
        }

        .avatar-edit-btn:hover {
          background: var(--color-primary-dark);
          transform: scale(1.05);
        }

        .image-options {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 12px var(--shadow-color);
          z-index: 10;
          min-width: 150px;
          overflow: hidden;
          margin-top: var(--space-2);
        }

        .image-option {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          width: 100%;
          padding: var(--space-3);
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: background var(--transition-fast);
          text-align: left;
          color: var(--text-primary);
        }

        .image-option:hover {
          background: var(--bg-secondary);
        }

        .image-option--danger {
          color: var(--color-danger);
        }

        .image-option--danger:hover {
          background: var(--color-danger-light);
        }

        .profile-image-upload {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .image-upload-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .profile-details {
          flex: 1;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-3);
        }

        .profile-name {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin: 0;
          color: var(--text-primary);
        }

        .profile-status {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          color: var(--color-success);
          font-size: var(--font-size-xs);
          background: var(--color-success-light);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
        }

        .profile-bio {
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: var(--space-3);
          font-size: var(--font-size-sm);
          line-height: 1.5;
        }

        .favorite-genres {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-4);
        }

        .profile-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--text-secondary);
          position: relative;
        }

        .privacy-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--space-1);
          margin-left: auto;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .privacy-toggle:hover {
          background: var(--bg-secondary);
          color: var(--color-primary);
          transform: scale(1.1);
        }

        .visibility-toggle {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: var(--font-size-sm);
          color: var(--text-primary);
          text-transform: capitalize;
        }

        .visibility-toggle:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }

        .profile-form {
          max-width: 500px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-label {
          display: block;
          margin-bottom: var(--space-2);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          transition: border-color var(--transition-fast);
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        .form-help-text {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          margin-top: var(--space-1);
        }

        .form-actions {
          margin-top: var(--space-6);
        }

        .settings-card {
          transition: all var(--transition-medium);
        }

        .settings-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px var(--shadow-hover);
        }

        .settings-section {
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border-color);
        }

        .setting-info {
          display: flex;
          flex-direction: column;
        }

        .setting-title {
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .setting-description {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          background: var(--bg-primary);
        }

        .setting-item:hover {
          background: var(--bg-secondary);
          border-color: var(--color-primary);
          transform: translateX(2px);
        }

        .setting-label {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          cursor: pointer;
          flex: 1;
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--text-primary);
        }

        .setting-text {
          display: flex;
          flex-direction: column;
        }

        .setting-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .security-info {
          margin-top: var(--space-4);
          padding-top: var(--space-4);
          border-top: 1px solid var(--border-color);
        }

        .security-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .security-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .security-value {
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .quick-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .stat-card:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
        }

        .stat-icon--primary {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
        }

        .stat-icon--success {
          background: var(--color-success-light);
          color: var(--color-success-dark);
        }

        .stat-icon--warning {
          background: var(--color-warning-light);
          color: var(--color-warning-dark);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .order-tabs {
          display: flex;
          gap: var(--space-1);
        }

        .tab-btn {
          padding: var(--space-2) var(--space-3);
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: var(--radius-md);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          transition: all var(--transition-fast);
        }

        .tab-btn--active {
          background: var(--color-primary);
          color: white;
        }

        .tab-btn:not(.tab-btn--active):hover {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .order-filters {
          margin-bottom: var(--space-4);
        }

        .filter-select {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: var(--font-size-sm);
          cursor: pointer;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .order-item {
          padding: var(--space-4);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          background: var(--bg-primary);
        }

        .order-item:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--shadow-color);
          border-color: var(--color-primary);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .order-id {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .order-details {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .order-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }

        .order-date, .order-total {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .order-total {
          font-weight: var(--font-weight-semibold);
          color: var(--color-success);
        }

        .order-items-count {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .tracking-info {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }

        .tracking-label {
          color: var(--text-muted);
        }

        .tracking-number {
          font-family: monospace;
          background: var(--bg-tertiary);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-sm);
          font-weight: var(--font-weight-medium);
        }

        .order-rating {
          display: flex;
          gap: var(--space-1);
          align-items: center;
        }

        .star-filled {
          color: var(--color-warning);
          fill: currentColor;
        }

        .star-empty {
          color: var(--color-gray-300);
        }

        .view-all-btn {
          margin-top: var(--space-4);
          width: 100%;
        }

        .wishlist-preview {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .wishlist-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .wishlist-item:hover {
          background: var(--bg-secondary);
          transform: translateX(2px);
        }

        .wishlist-info {
          display: flex;
          flex-direction: column;
        }

        .wishlist-title {
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
          font-size: var(--font-size-sm);
        }

        .wishlist-author {
          font-size: var(--font-size-xs);
          color: var(--text-muted);
        }

        .wishlist-price {
          font-weight: var(--font-weight-semibold);
          color: var(--color-success);
          font-size: var(--font-size-sm);
        }

        .no-orders {
          text-align: center;
          padding: var(--space-8);
          color: var(--text-muted);
        }

        .no-orders p {
          margin: var(--space-4) 0 var(--space-6);
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-3) 0;
          border-bottom: 1px solid var(--border-color);
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .stat-value {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .stat-value--highlight {
          color: var(--color-success);
          font-size: var(--font-size-lg);
        }

        .completion-bar {
          position: relative;
          width: 80px;
          height: 20px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .completion-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(135deg, var(--color-success), var(--color-primary));
          border-radius: var(--radius-full);
          transition: width var(--transition-medium);
        }

        .completion-text {
          position: relative;
          z-index: 1;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-badge--premium {
          background: linear-gradient(135deg, var(--color-warning-light), var(--color-warning));
          color: var(--color-warning-dark);
        }

        .status-badge--regular {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
        }

        /* Badge styles */
        .badge {
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          text-transform: uppercase;
        }

        .badge--warning {
          background: var(--color-warning-light);
          color: var(--color-warning-dark);
        }

        .badge--info {
          background: var(--color-info-light);
          color: var(--color-info-dark);
        }

        .badge--primary {
          background: var(--color-primary-light);
          color: var(--color-primary-dark);
        }

        .badge--success {
          background: var(--color-success-light);
          color: var(--color-success-dark);
        }

        .badge--danger {
          background: var(--color-danger-light);
          color: var(--color-danger-dark);
        }

        /* Alert styles */
        .alert {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          animation: slideInFromTop 0.3s ease-out;
        }

        .alert--success {
          background: var(--color-success-light);
          color: var(--color-success-dark);
          border: 1px solid var(--color-success);
        }

        .alert--error {
          background: var(--color-danger-light);
          color: var(--color-danger-dark);
          border: 1px solid var(--color-danger);
        }

        @keyframes slideInFromTop {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Button styles */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-decoration: none;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn--xs {
          padding: var(--space-1) var(--space-2);
          font-size: var(--font-size-xs);
        }

        .btn--sm {
          padding: var(--space-2) var(--space-3);
          font-size: var(--font-size-xs);
        }

        .btn--primary {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .btn--primary:hover:not(:disabled) {
          background: var(--color-primary-dark);
          border-color: var(--color-primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .btn--primary:active {
          transform: translateY(0);
        }

        .btn--outline {
          border-color: var(--border-color);
          color: var(--text-secondary);
          background: var(--bg-primary);
          box-shadow: 0 1px 2px var(--shadow-color);
        }

        .btn--outline:hover:not(:disabled) {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: var(--color-primary-light);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px var(--shadow-color);
        }

        .btn--danger {
          border-color: var(--color-danger);
          color: var(--color-danger);
        }

        .btn--danger:hover:not(:disabled) {
          background: var(--color-danger);
          color: white;
          transform: translateY(-1px);
        }

        /* Loading spinner */
        .spinner {
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: var(--radius-full);
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .spinner--sm {
          width: 16px;
          height: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Card styles */
        .card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          box-shadow: 0 2px 4px var(--shadow-color);
          overflow: hidden;
          border: 1px solid var(--border-color);
          transition: all var(--transition-medium);
        }

        .profile-card {
          border: 2px solid var(--color-primary-light);
        }

        .card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6);
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-primary);
        }

        .card__body {
          padding: var(--space-6);
          background: var(--bg-primary);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .profile-layout {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }

          .profile-sidebar {
            position: static;
          }

          .page__header {
            flex-direction: column;
            gap: var(--space-4);
            align-items: start;
          }

          .quick-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .profile-info {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }

          .profile-header {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }

          .profile-image-upload {
            flex-direction: column;
            text-align: center;
          }

          .image-upload-actions {
            flex-direction: row;
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .order-header,
          .order-details {
            flex-direction: column;
            gap: var(--space-2);
            align-items: start;
          }

          .order-meta {
            flex-direction: column;
            gap: var(--space-1);
            align-items: start;
          }

          .profile-actions {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .card__header {
            padding: var(--space-4);
            flex-direction: column;
            gap: var(--space-3);
            align-items: start;
          }

          .card__body {
            padding: var(--space-4);
          }

          .page {
            padding: var(--space-4);
          }

          .quick-stats {
            grid-template-columns: 1fr;
          }

          .order-tabs {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .profile-info {
            gap: var(--space-4);
          }

          .contact-item {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }

          .privacy-toggle {
            margin-left: 0;
            margin-top: var(--space-2);
          }

          .image-upload-actions {
            flex-direction: column;
            width: 100%;
          }

          .setting-item {
            padding: var(--space-3);
          }

          .profile-actions {
            flex-direction: column;
          }

          .image-options {
            left: 50%;
            transform: translateX(-50%);
          }

          .stat-card {
            padding: var(--space-3);
          }

          .wishlist-item {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }

          .completion-bar {
            width: 60px;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for accessibility */
        .btn:focus,
        .form-input:focus,
        .setting-checkbox:focus,
        .tab-btn:focus,
        .filter-select:focus {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :root {
            --border-color: currentColor;
            --shadow-color: transparent;
          }
        }
      `}</style>
        </div>
    )
  }