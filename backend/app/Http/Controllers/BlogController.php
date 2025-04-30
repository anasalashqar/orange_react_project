<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::with('user')->latest()->paginate(10);
        return response()->json($blogs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'published' => 'boolean',
        ]);

        $blog = new Blog();
        $blog->title = $request->title;
        $blog->content = $request->content;
        $blog->published = $request->published ?? true;
        $blog->user_id = Auth::id();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blog_images', 'public');
            $blog->image = $path;
        }

        $blog->save();

        return response()->json([
            'message' => 'Blog created successfully',
            'blog' => $blog
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $blog = Blog::with(['user', 'comments', 'likes'])->findOrFail($id);
        return response()->json($blog);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $blog = Blog::findOrFail($id);

        // Authorization: check if current user owns this blog
        if ($blog->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'You are not authorized to update this blog'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'published' => 'boolean',
        ]);

        $blog->title = $request->title;
        $blog->content = $request->content;
        $blog->published = $request->published ?? $blog->published;

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            
            $path = $request->file('image')->store('blog_images', 'public');
            $blog->image = $path;
        }

        $blog->save();

        return response()->json([
            'message' => 'Blog updated successfully',
            'blog' => $blog
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $blog = Blog::findOrFail($id);

        // Authorization: check if current user owns this blog
        if ($blog->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'You are not authorized to delete this blog'
            ], 403);
        }

        // Delete associated image if exists
        if ($blog->image) {
            Storage::disk('public')->delete($blog->image);
        }

        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully'
        ]);
    }

    /**
     * Add a comment to the blog.
     */
    public function addComment(Request $request, string $id)
    {
        $blog = Blog::findOrFail($id);
        
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $blog->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment
        ], 201);
    }

    /**
     * Like or unlike the blog.
     */
    public function like(string $id)
    {
        $blog = Blog::findOrFail($id);
        $user = Auth::user();

        // Check if user has already liked the blog
        $existingLike = $blog->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            // Unlike the blog
            $existingLike->delete();
            return response()->json([
                'message' => 'Blog unliked successfully'
            ]);
        } else {
            // Like the blog
            $blog->likes()->create([
                'user_id' => $user->id
            ]);
            
            return response()->json([
                'message' => 'Blog liked successfully'
            ], 201);
        }
    }
    
    /**
     * Get blogs by the currently authenticated user.
     */
    public function userBlogs()
    {
        $blogs = Blog::where('user_id', Auth::id())->latest()->paginate(10);
        return response()->json($blogs);
    }
}
