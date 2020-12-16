class UsersController < ApplicationController
    $user_stor_dir = "#{Rails.root}/data/user"

    def show
        id = cookies.encrypted[:user]
        @user = User.find(id)
    end


    def add_data_to_set(file_dict, dataset_name)
        id = cookies.encrypted[:user]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id)
        dataset_dir = File.join(user_dir, dataset_name)
        file_dict.keys.each do |key|
            file_path = File.join(dataset_dir, key)
            file = File.open(file_path, "w")
            file.write(file_dict[key])
            file.close
        end

    end

    
end
