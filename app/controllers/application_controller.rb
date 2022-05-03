class ApplicationController < ActionController::Base
    before_action :require_cookie

    $user_stor_dir = "#{Rails.root}/data/user" 

    def change_dark
        session[:dark] = !session[:dark]
        respond_to do |format|
            format.js {render inline: "location.reload();" }
        end
    end

    private
    
    def require_cookie
        # no cookie found 
        unless session[:user_id]
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
            session[:dark] = false
            
        end
        # check user
        id = session[:user_id]
        if User.exists? id
            
            @user = User.find(id)
            @user.touch

        else 
            # already expired
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id

        end
        
        #user_dir = File.join($user_stor_dir, session[:user_id].to_s)  
        # unless File.directory?(user_dir)
        #     Dir.mkdir(user_dir)
        # end
    end


end
