package com.wealthera.arthplus.api

import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import java.time.Instant

// --- Data Classes ---
data class MediaUploadItem(
    val type: String,
    val fileName: String,
    val requestId: String,
    val description: String
)

data class MediaUploadRequest(
    val sessionId: String,
    val customerId: Long,
    val medias: List<MediaUploadItem>
)

data class UploadedMediaItem(
    val type: String,
    val requestId: String,
    val url: String,
    val description: String
)

data class MediaUploadResponse(
    val status: String,
    val errorCode: String,
    val message: String,
    val timestamp: Long,
    val uploadedMedia: List<UploadedMediaItem>
)

data class ChatMediaItem(
    val type: String,
    val url: String,
    val description: String
)

data class ChatAnalysisRequest(
    val sessionId: String,
    val customerId: Long,
    val message: String,
    val medias: List<ChatMediaItem>
)

data class SuggestedFollowUp(
    val content: String
)

data class ChatAnalysisBody(
    val message: String,
    val medias: List<ChatMediaItem>,
    val suggestedFollowUps: List<SuggestedFollowUp>
)

data class ChatAnalysisResponse(
    val timestamp: Long,
    val body: ChatAnalysisBody?,
    val message: String,
    val errorCode: String,
    val status: String
)

// --- Controller ---
@RestController
@RequestMapping("/api/user/chat")
class ChatController {

    @PostMapping("/media/upload")
    fun uploadMedia(
        @RequestBody request: MediaUploadRequest
    ): ResponseEntity<MediaUploadResponse> {
        val uploadedMedia = request.medias.map { media ->
            UploadedMediaItem(
                type = media.type,
                requestId = media.requestId,
                url = "https://arth-s3-storage-prod.s3.amazonaws.com/images/${request.customerId}/${request.sessionId}/${media.fileName}",
                description = "Portfolio image uploaded"
            )
        }
        val response = MediaUploadResponse(
            status = "SUCCESS",
            errorCode = "0",
            message = "",
            timestamp = Instant.now().toEpochMilli(),
            uploadedMedia = uploadedMedia
        )
        return ResponseEntity.ok(response)
    }

    @PostMapping
    fun analyzeChat(
        @RequestBody request: ChatAnalysisRequest
    ): ResponseEntity<ChatAnalysisResponse> {
        val analysisMedia = listOf(
            ChatMediaItem(
                type = "image",
                url = "https://arth-s3-storage-prod.s3.amazonaws.com/images/${request.customerId}/${request.sessionId}/analysis_result.jpg",
                description = "portfolio"
            )
        )
        val followUps = listOf(
            SuggestedFollowUp("Would you like me to focus on a specific aspect of the image, such as fund performance or diversification?"),
            SuggestedFollowUp("What would you like to do next?")
        )
        val body = ChatAnalysisBody(
            message = "Analyze portfolio",
            medias = analysisMedia,
            suggestedFollowUps = followUps
        )
        val response = ChatAnalysisResponse(
            timestamp = Instant.now().toEpochMilli(),
            body = body,
            message = "",
            errorCode = "0",
            status = "SUCCESS"
        )
        return ResponseEntity.ok(response)
    }
} 
