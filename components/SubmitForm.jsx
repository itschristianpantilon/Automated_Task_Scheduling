import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput';
import FileCard from './FileCard';
import CommentCard from './CommentCard';
import { uploadFile, addComment, updateAssignedTaskStatus, config, storage, getCurrentUser, getComments } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';
import * as DocumentPicker from 'expo-document-picker';



const SubmitForm = ({ assignedTaskId, isCreator, taskId, refreshTaskDetails, currentUser, memberId  }) => {
    const [isMember, setIsMember] = useState(true);
    const [inputComment, setInputComment] = useState(false);
    const [showInputComment, setShowInputComment] = useState(true);
    const [comment, setComment] = useState('');
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState([]);

    console.log("MemberId:",memberId)
    console.log("Assigned TaskId:", assignedTaskId)
    console.log("TaskId:", taskId)

    const fetchComments = async () => {
        try {
            const fetchedComments = await getComments(taskId) // Assuming getComments is a function in lib/appwrite that retrieves comments for a task
            setComments(fetchedComments)
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [taskId, assignedTaskId])

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

    // const handleUploadFile = async () => {
    //     if (!file) {
    //         Alert.alert("Error", "No file selected. Please select a file to upload.");
    //         return;
    //     }
    //     try {
    //         const uploadedFile = await storage.createFile(config.storageId, ID.unique(), file);
    //         console.log('File uploaded successfully:', uploadedFile);
    //       } catch (error) {
    //         console.error('Detailed file upload error:', error);
    //         Alert.alert('File upload error', error.message || 'An unknown error occurred');
    //       }
    // };

    const handleUploadFile = async () => {
        if (!file) {
          Alert.alert("Error", "No file selected. Please select a file to upload.");
          return;
        }
        try {
          const uploadedFile = await storage.createFile(config.storageId, ID.unique(), file);
          console.log('File uploaded successfully:', uploadedFile);
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
            const newComment = {
                id: ID.unique(),
                username: res.username,
                commentText: comment,
                avatar: res.avatar,
                memberId: memberId,
            };

            if (!taskId || !res.$id) {
                throw new Error("User or Task information is missing?");
            }
    
            await addComment(taskId, res.$id, res.username, comment, res.avatar, memberId);
            
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
            setShowInputComment(true);
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
      <View>
        <Text>Attachment</Text>
        <View className='border h-[20vh] w-full p-2'>
                <ScrollView>
                {file ? (
                    <FileCard fileName={file.name} fileUri={file.uri} onDelete={() => setFile(null)} />
                ) : (
                    <Text>You have no attachment uploaded.</Text>
                )}
    
                </ScrollView>
        </View>
      </View>

      <View>
        <Text>Private Comments</Text>
            <View className='border h-[15vh] w-full'>
                    <ScrollView>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentCard 
                                key={comment.$id} 
                                username={comment?.username} 
                                commentText={comment?.commentText || comment.comment} 
                                userAvatar={comment?.avatar}
                            />
                        ))
                    ) : (
                         <Text>No Comment</Text>
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
            <View className='items-center mt-5'>
                <CustomInput 
                    title='Add Comment'
                    value={comment}
                    placeholder=''
                    handleChangeText={setComment}
                    otherStyles='mb-2'
                    textStyle=''
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
        <View className={`absolute w-full p-2 bottom-0`}>

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
                containerStyles="min-h-[40px] rounded-md border border-gray-400/70 mb-2"
                handlePress={() => updateAssignedTaskStatus(assignedTaskId, 'Completed')}
                icon={() => {}}
                iconStyle=""
            />


            <CustomButton 
                title="Reject"
                textStyles="text-base text-black font-psemibold"
                containerStyles="min-h-[40px] rounded-md bg-white border border-gray-400/70"
                handlePress={() => updateAssignedTaskStatus(assignedTaskId, 'Rejected')}
                icon={() => {}}
                iconStyle=""
            />
        </View>
    )}

    </View>
  )
}

export default SubmitForm