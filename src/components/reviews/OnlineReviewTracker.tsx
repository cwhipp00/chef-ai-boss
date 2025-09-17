import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageCircle, TrendingUp, AlertCircle, Calendar, User, Flag, Bot, Reply } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrganization } from '@/hooks/useUserOrganization';

export default function OnlineReviewTracker() {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { organization } = useUserOrganization();

  const [newReview, setNewReview] = useState({
    platform: '',
    reviewerName: '',
    rating: 5,
    reviewText: '',
    reviewDate: new Date().toISOString().split('T')[0],
    sentiment: 'neutral'
  });

  const loadReviews = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('online_reviews' as any)
        .select('*')
        .eq('organization_id', organization.id)
        .order('review_date', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organization) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('online_reviews' as any)
        .insert([{
          organization_id: organization.id,
          platform: newReview.platform,
          reviewer_name: newReview.reviewerName,
          rating: newReview.rating,
          review_text: newReview.reviewText,
          review_date: newReview.reviewDate,
          sentiment: newReview.sentiment
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Review Added",
        description: "The review has been successfully added to tracking.",
      });

      setNewReview({
        platform: '',
        reviewerName: '',
        rating: 5,
        reviewText: '',
        reviewDate: new Date().toISOString().split('T')[0],
        sentiment: 'neutral'
      });
      setShowAddForm(false);
      loadReviews();
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoResponse = async (reviewId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Generate AI response using Supabase function
      const { data, error } = await supabase.functions.invoke('ai-sentiment-analyzer', {
        body: {
          action: 'generate_response',
          review_id: reviewId
        }
      });

      if (error) throw error;

      // Update the review with the auto-generated response
      const { error: updateError } = await supabase
        .from('online_reviews' as any)
        .update({
          response_text: data.response,
          responded_at: new Date().toISOString(),
          responded_by: user.id,
          auto_response: true
        })
        .eq('id', reviewId);

      if (updateError) throw updateError;

      toast({
        title: "Auto-Response Generated",
        description: "AI has generated and posted a response to this review.",
      });

      loadReviews();
    } catch (error) {
      console.error('Error generating auto-response:', error);
      toast({
        title: "Error",
        description: "Failed to generate auto-response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualResponse = async (reviewId: string, responseText: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('online_reviews' as any)
        .update({
          response_text: responseText,
          responded_at: new Date().toISOString(),
          responded_by: user.id,
          auto_response: false
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Response Posted",
        description: "Your response has been saved.",
      });

      loadReviews();
    } catch (error) {
      console.error('Error posting response:', error);
      toast({
        title: "Error",
        description: "Failed to post response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFlag = async (reviewId: string, currentFlag: boolean) => {
    try {
      const { error } = await supabase
        .from('online_reviews' as any)
        .update({ flagged: !currentFlag })
        .eq('id', reviewId);

      if (error) throw error;
      loadReviews();
    } catch (error) {
      console.error('Error flagging review:', error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [organization]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'google': return 'bg-blue-500';
      case 'yelp': return 'bg-red-500';
      case 'facebook': return 'bg-blue-600';
      case 'tripadvisor': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const positiveReviews = reviews.filter(r => r.sentiment === 'positive').length;
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Online Review Tracker
          </h2>
          <p className="text-muted-foreground">Monitor and respond to customer reviews across platforms</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-response"
              checked={autoResponseEnabled}
              onCheckedChange={setAutoResponseEnabled}
            />
            <Label htmlFor="auto-response">Auto-Response</Label>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-gradient-primary">
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{reviews.length}</div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{positiveReviews}</div>
                <p className="text-sm text-muted-foreground">Positive Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{negativeReviews}</div>
                <p className="text-sm text-muted-foreground">Negative Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newReview.platform} onValueChange={(value) => setNewReview(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Yelp">Yelp</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
                      <SelectItem value="OpenTable">OpenTable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reviewerName">Reviewer Name</Label>
                  <Input
                    id="reviewerName"
                    value={newReview.reviewerName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={newReview.rating.toString()} onValueChange={(value) => setNewReview(prev => ({ ...prev, rating: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reviewDate">Review Date</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={newReview.reviewDate}
                    onChange={(e) => setNewReview(prev => ({ ...prev, reviewDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sentiment">Sentiment</Label>
                <Select value={newReview.sentiment} onValueChange={(value) => setNewReview(prev => ({ ...prev, sentiment: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reviewText">Review Text</Label>
                <Textarea
                  id="reviewText"
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder="Enter the review text..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Review"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className={review.flagged ? 'border-destructive/50' : ''}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getPlatformColor(review.platform)}`}>
                      {review.platform.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                        <div className="flex items-center">{renderStars(review.rating)}</div>
                        <Badge variant={getSentimentColor(review.sentiment)}>
                          {review.sentiment}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.review_date).toLocaleDateString()}
                        </span>
                        <span>{review.platform}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFlag(review.id, review.flagged)}
                    className={review.flagged ? 'text-destructive' : ''}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                {/* Review Text */}
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm">{review.review_text}</p>
                </div>

                {/* Response Section */}
                <div className="border-t pt-4">
                  {review.response_text ? (
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Reply className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Your Response</span>
                        {review.auto_response && (
                          <Badge variant="outline" className="text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{review.response_text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded {new Date(review.responded_at).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {autoResponseEnabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutoResponse(review.id)}
                          disabled={loading}
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Generate AI Response
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const response = prompt("Enter your response:");
                          if (response) handleManualResponse(review.id, response);
                        }}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Manual Response
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground">Start tracking your online reviews to improve customer satisfaction</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}