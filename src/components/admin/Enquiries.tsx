
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageSquare, Mail, User, Clock, Reply, Send, Trash2 } from 'lucide-react';

export const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      userName: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      subject: 'Bulk Order Inquiry',
      message: 'Hi, I want to place a bulk order for Diwali. Can you provide wholesale pricing for 500+ items?',
      date: '2024-01-15',
      status: 'pending',
      reply: ''
    },
    {
      id: 2,
      userName: 'Priya Patel',
      email: 'priya@yahoo.com',
      subject: 'Delivery Question',
      message: 'Do you deliver to Pune? What are the delivery charges and time?',
      date: '2024-01-14',
      status: 'replied',
      reply: 'Yes, we deliver to Pune. Delivery charges are ₹50 and it takes 2-3 business days.'
    },
    {
      id: 3,
      userName: 'Amit Kumar',
      email: 'amit@hotmail.com',
      subject: 'Product Availability',
      message: 'Are sky shots available? I need them for a wedding celebration.',
      date: '2024-01-13',
      status: 'pending',
      reply: ''
    }
  ]);

  const [replyText, setReplyText] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  const handleReply = () => {
    if (selectedEnquiry && replyText.trim()) {
      setEnquiries(enquiries.map(enquiry =>
        enquiry.id === selectedEnquiry.id
          ? { ...enquiry, reply: replyText, status: 'replied' }
          : enquiry
      ));
      setReplyText('');
      setSelectedEnquiry(null);
      setIsReplyDialogOpen(false);
    }
  };

  const openReplyDialog = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setReplyText(enquiry.reply || '');
    setIsReplyDialogOpen(true);
  };

  const handleDeleteEnquiry = (enquiryId: number) => {
    setEnquiries(enquiries.filter(enquiry => enquiry.id !== enquiryId));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customer Enquiries</h1>
        <p className="text-gray-600 mt-2">Manage customer inquiries and provide support</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enquiries</p>
                <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enquiries.filter(e => e.status === 'replied').length}
                </p>
              </div>
              <Reply className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((enquiries.filter(e => e.status === 'replied').length / enquiries.length) * 100)}%
                </p>
              </div>
              <Mail className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <Card key={enquiry.id} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{enquiry.subject}</CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                      <p className="text-sm text-gray-600 flex items-center">
                        <User className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{enquiry.userName}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{enquiry.email}</span>
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="whitespace-nowrap">{enquiry.date}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <Badge className={`whitespace-nowrap ${enquiry.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {enquiry.status === 'replied' ? 'Replied' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Customer Message:</p>
                <p className="text-gray-800">{enquiry.message}</p>
              </div>
              
              {enquiry.reply && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                  <p className="text-sm font-medium text-blue-700 mb-2">Your Reply:</p>
                  <p className="text-blue-800">{enquiry.reply}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 whitespace-nowrap">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Enquiry</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this enquiry? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteEnquiry(enquiry.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  onClick={() => openReplyDialog(enquiry)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white whitespace-nowrap"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  {enquiry.reply ? 'Update Reply' : 'Reply'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Reply to: {selectedEnquiry?.subject}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Original Message:</p>
              <p className="text-gray-800">{selectedEnquiry?.message}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Reply:</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={5}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsReplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReply}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {enquiries.length === 0 && (
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Enquiries</h3>
            <p className="text-gray-500">No customer enquiries at the moment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
