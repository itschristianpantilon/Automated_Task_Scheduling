import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput';
import FileCard from './FileCard';
import CommentCard from './CommentCard';
import { uploadFile, addComment, updateAssignedTaskStatus, config, storage, getCurrentUser, getComments } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';
import * as DocumentPicker from 'expo-document-picker';
import EmptySubmitComponent from './EmptySubmitComponent';
import { icons } from '../constants';



const SubmitForm = ({ assignedTaskId, isCreator, taskId, refreshTaskDetails, isSubmit , memberId, username, status  }) => {
    const [isMember, setIsMember] = useState(true);
    const [inputComment, setInputComment] = useState(false);
    const [showInputComment, setShowInputComment] = useState(true);
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState([]);

    // console.log("MemberId:",memberId)
    // console.log("Assigned TaskId:", assignedTaskId)
    // console.log("TaskId:", taskId)
    // console.log('Current User: ', currentUser)

    

    const fetchComments = async () => {
        try {
            const fetchedComments = await getComments(assignedTaskId);
            //console.log("Fetched Comments:", fetchedComments); // Check if the comments are being fetched correctly
            setComments(fetchedComments); // Store the comments into state
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }
    
    useEffect(() => {
        fetchComments(); // Trigger fetch when taskId or assignedTaskId changes
    }, [assignedTaskId]);
    
    

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
        
            if (result.type === 'cancel') {
                // The user canceled the picker
                console.log("Document picking was canceled");
                return;
            }
            const file = result.assets[0];  // Assuming there's only one file selected
            if (file) {
                setFile(file); // Set the file object with uri and name
                console.log("File selected:", file);
                console.log(file.uri);  // This should now log the correct file URI
            }
        } catch (err) {
           
                console.error("Error selecting file:", err);
                Alert.alert("Error", "Failed to select a file");
        
        }
    };



    const handleUploadFile = async () => {
        if (!file) {
          Alert.alert("Error", "No file selected. Please select a file to upload.");
          return;
        }
        updateAssignedTaskStatus(assignedTaskId, 'Verifying');
          console.log(assignedTaskId)
        try {
          const uploaded = await uploadFile(file, memberId);
          setFile(uploaded);
          console.log('File Uploaded', uploaded);
          

        } catch (error) {
          console.error('Detailed file upload error:', error);
          Alert.alert('File upload error', error.message || 'An unknown error occurred');
        }
      };
      
      const canAddComment = isCreator || isMember;

    const handleAddComment = async () => {
        if (!comment || !canAddComment) return;
    
        try {
            const res = await getCurrentUser();
    
            // Add detailed logging for debugging
            console.log("Current values in handleAddComment:");
            console.log("taskId:", taskId);
            console.log("memberId:", memberId);
            console.log("res.$id (userId):", res?.$id);
            console.log("comment:", comment);
    
            // Check for missing values
            if (!taskId) {
                console.error("Error: taskId is missing");
                throw new Error("Task ID is missing");
            }
            if (!res?.$id) {
                console.error("Error: User ID (res.$id) is missing");
                throw new Error("User ID is missing");
            }
            if (!memberId) {
                console.error("Error: memberId is missing");
                throw new Error("Member ID is missing");
            }
    
            // Proceed to add the comment
            await addComment(taskId, res.$id, res.username, comment, res.avatar, memberId, assignedTaskId);
    
            // Update comments array with the new comment
            setComments((prev) => [
                ...prev,
                {
                    id: ID.unique(),
                    username: res.username,
                    commentText: comment,
                    avatar: res.avatar,
                },
            ]);
    
            setComment('');
            setShowInputComment(false);
            refreshTaskDetails();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    

    const showCommentInputBTN = () => {
        setInputComment(true);
        setShowInputComment(false)
    };

  return (
    <View className='relative min-h-[78vh]'>
      <View className='border-y-[1px] h-[20vh] border-y-black-100/30 w-full p-2'>
        <Text className='text-sm font-pregular'>{!file ? '' : 'Attachment'}</Text>
        <View className='py-1'>
                <ScrollView>
                {file ? (
                    <FileCard fileName={file.name} fileUri={file.uri} onDelete={() => setFile(null)} />
                ) : (
                    <View className='items-center justify-center h-[12vh]'>
                        <EmptySubmitComponent 
                            icon={icons.noAttachment}
                            text={isCreator ? `${username} have no attachment uploaded.`: 'You have no attachment uploaded.'}
                        />
                    </View>
                )}
    
                </ScrollView>
        </View>
      </View>

      <View className='border-y-[1px] border-y-black-100/30 h-[20vh] w-full px-1 py-2 mt-3'>
        <Text className='text-sm font-pregular'>{comments.length === 0 ? '' : 'Private Comments'}</Text>
            <View className='py-1'>
                    <ScrollView className='h-[15vh]'>
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <CommentCard 
                                    key={`${comment.id} - ${index}`} 
                                    username={comment?.username} 
                                    commentText={comment?.commentText || comment.comment} 
                                    userAvatar={comment?.avatar}
                                />
                            ))
                    ) : (
                        <View className='items-center justify-center h-[15vh]'>
                            <EmptySubmitComponent 
                                icon={icons.commentSlash}
                                text='No Comment'
                            />
                        </View>
                    )}
                    </ScrollView>
            </View>

      </View>

            {showInputComment && canAddComment && (
            <CustomButton 
                title="Add Comment"
                textStyles="text-base text-white font-psemibold"
                containerStyles="min-h-[40px] rounded-md border border-gray-400/70 my-4"
                handlePress={showCommentInputBTN}
                icon={() => {}}
                iconStyle=""
                />
            )}

        {inputComment && canAddComment && (
            <View className='items-center mt-2'>
                <Text className='w-full text-[12px] font-pregular'>Add Comment</Text>
                <CustomInput 
                    value={comment}
                    placeholder=''
                    handleChangeText={setComment}
                    otherStyles='mb-2'
                    textStyle=''
                    inputSyle='h-10'
                />
                <CustomButton 
                    title="Send Comment"
                    textStyles="text-xs text-white font-psemibold"
                    containerStyles="min-h-[30px] rounded-md border border-gray-400/70 w-[50%]"
                    handlePress={handleAddComment}
                    icon={() => {}}
                    iconStyle=""
                />
            </View>
    )}

    {isMember && (
        <View className={`absolute w-full p-2 bottom-0 ${isCreator ? 'hidden' : ''}`}>

            <CustomButton 
                title="Upload Attachment"
                textStyles="text-sm text-black font-pregular"
                containerStyles="min-h-[40px] rounded-md border border-gray-400/70 mb-2 bg-white"
                handlePress={handleSelectFile}
                icon={() => {}}
                iconStyle=""
            />


            <CustomButton 
                title="Submit"
                textStyles="text-base text-white font-psemibold"
                containerStyles="min-h-[40px] rounded-md"
                handlePress={handleUploadFile}
                icon={() => {}}
                iconStyle=""
            />
        </View>
    )}

    {isCreator && (
        <View className={`absolute w-full p-2 bottom-0`}>

            <CustomButton 
                title="Accept"
                textStyles="text-base text-white font-psemibold"
                containerStyles={`min-h-[40px] rounded-md border border-gray-400/70 mb-2 ${status === 'Rejected' || status === 'Accepted' ? 'opacity-60' : ''}`}
                handlePress={() => updateAssignedTaskStatus(assignedTaskId, 'Accepted')}
                icon={() => {}}
                iconStyle=""
                isLoading={status === 'Rejected' || status === 'Accepted'}
            />


            <CustomButton 
                title="Reject"
                textStyles="text-base text-black font-psemibold"
                containerStyles="min-h-[40px] rounded-md bg-white border border-gray-400/70"
                handlePress={() => updateAssignedTaskStatus(assignedTaskId, 'Rejected')}
                icon={() => {}}
                iconStyle=""
                isLoading={status === 'Rejected' || status === 'Accepted'}
            />
        </View>
    )}

    </View>
  )
}

export default SubmitForm