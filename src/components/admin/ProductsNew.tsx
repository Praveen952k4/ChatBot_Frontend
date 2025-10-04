import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, IndianRupee, Tag, Star, Upload, Video, Sparkles, Edit, ChevronUp, ChevronDown, Settings } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  video: string;
  salePrice: number;
  originalPrice: number;
}

interface ProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  highlightId?: string | number;
}

export const ProductsNew = ({ products, setProducts, highlightId }: ProductsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    video: '',
    salePrice: 0,
    originalPrice: 0
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showHiddenButton, setShowHiddenButton] = useState(false);
  const [minimumCheckoutValue, setMinimumCheckoutValue] = useState(500);
  const [isMinimumDialogOpen, setIsMinimumDialogOpen] = useState(false);

  // Handle highlighting when highlightId is provided
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`product-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-orange-500', 'ring-opacity-75');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-orange-500', 'ring-opacity-75');
        }, 3000);
      }
    }
  }, [highlightId]);

  const categories = [
    'Sparklers',
    'Ground Crackers', 
    'Aerial Fireworks',
    'Flower Pots',
    'Rockets',
    'Chakri',
    'Anar',
    'Serpent',
    'Bombs',
    'Gift Boxes'
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: products.length + 1,
      ...newProduct
    };
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      category: '',
      description: '',
      image: '',
      video: '',
      salePrice: 0,
      originalPrice: 0
    });
    setIsDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getDiscountPercentage = (original: number, sale: number) => {
    if (original <= sale) return 0;
    return Math.round(((original - sale) / original) * 100);
  };

  const handleMinimumCheckoutChange = (value: string) => {
    // Remove any non-digit characters and convert to number
    const cleanValue = value.replace(/[^\d]/g, '');
    const numValue = cleanValue === '' ? 0 : parseInt(cleanValue);
    setMinimumCheckoutValue(numValue);
  };

  const incrementMinimumCheckout = () => {
    setMinimumCheckoutValue(prev => prev + 50);
  };

  const decrementMinimumCheckout = () => {
    setMinimumCheckoutValue(prev => Math.max(0, prev - 50));
  };

  const handleMinimumValueSave = () => {
    console.log('Minimum checkout value set to:', minimumCheckoutValue);
    setIsMinimumDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your cracker products and inventory</p>
        </div>
        <div className="flex items-center gap-3">
          {showHiddenButton && (
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 border border-dashed"
              onClick={() => {
                console.log('Hidden function activated');
                // Add your hidden functionality here
              }}
            >
              🔒 Hidden
            </Button>
          )}
          
          <Dialog open={isMinimumDialogOpen} onOpenChange={setIsMinimumDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Set Min</span>
                    <span className="text-xs opacity-90">Checkout</span>
                  </div>
                  <IndianRupee className="w-4 h-4" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>Set Minimum Checkout Value</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minimum-checkout">Minimum Amount (₹)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="minimum-checkout"
                      type="text"
                      value={minimumCheckoutValue.toString()}
                      onChange={(e) => handleMinimumCheckoutChange(e.target.value)}
                      className="flex-1"
                      placeholder="Enter amount"
                    />
                    <div className="flex flex-col">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={incrementMinimumCheckout}
                        className="px-2 py-1 h-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={decrementMinimumCheckout}
                        className="px-2 py-1 h-8 border-blue-300 text-blue-600 hover:bg-blue-50 mt-1"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current minimum checkout value:</p>
                  <p className="font-bold text-xl text-green-600 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5" />
                    {minimumCheckoutValue}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleMinimumValueSave}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMinimumDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">Add New</span>
                    <span className="text-xs opacity-90">Product</span>
                  </div>
                  <Plus className="w-4 h-4" />
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span>Add New Product</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({...newProduct, salePrice: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video">Video URL (Optional)</Label>
                  <Input
                    id="video"
                    type="url"
                    value={newProduct.video}
                    onChange={(e) => setNewProduct({...newProduct, video: e.target.value})}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5 text-orange-600" />
              <span>Edit Product</span>
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-originalPrice">Original Price (₹)</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({...editingProduct, originalPrice: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salePrice">Sale Price (₹)</Label>
                  <Input
                    id="edit-salePrice"
                    type="number"
                    value={editingProduct.salePrice}
                    onChange={(e) => setEditingProduct({...editingProduct, salePrice: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  type="url"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-video">Video URL (Optional)</Label>
                <Input
                  id="edit-video"
                  type="url"
                  value={editingProduct.video}
                  onChange={(e) => setEditingProduct({...editingProduct, video: e.target.value})}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Update Product
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Secret key combination to show hidden button */}
      <div 
        className="absolute top-4 right-4 w-2 h-2 opacity-0 cursor-pointer"
        onClick={(e) => {
          if (e.detail === 3) { // Triple click
            setShowHiddenButton(!showHiddenButton);
          }
        }}
      />

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-orange-600" />
              <span>Search Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-orange-600" />
              <span>Filter by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card 
            key={product.id} 
            id={`product-${product.id}`}
            className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
                  <Package className="w-16 h-16 text-orange-400" />
                </div>
              )}
              {getDiscountPercentage(product.originalPrice, product.salePrice) > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                  {getDiscountPercentage(product.originalPrice, product.salePrice)}% OFF
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{product.name}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-lg text-green-600">₹{product.salePrice}</span>
                  </div>
                  {product.originalPrice > product.salePrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500">No products match your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
