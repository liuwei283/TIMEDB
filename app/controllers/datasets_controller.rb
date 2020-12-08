class DatasetsController < ApplicationController
    $stor_dir = "/Users/CHE/platform/user_meta"
    def show
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        Dir.mkdir(ds_dir) unless File.exists?(ds_dir)
        @file_list = Dir.entries(ds_dir)[2..-1]
    end

    def destroy
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        @dataset.destroy
        FileUtils.rm_r(ds_dir)
        redirect_to '/'
    end

    def edit
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
    end
    
    def update
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($stor_dir, id.to_s)
        old_dir = File.join(user_dir, @dataset.name)
         
        if @dataset.update(dataset_params)
            new_dir = File.join(user_dir, @dataset.name)
            File.rename(old_dir, new_dir) 
            redirect_to user_dataset_path(@dataset)
        else
            render 'edit'
        end
    end

    def download_file
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        file = File.join(ds_dir, params[:file_name])
        send_file file
    end

    def new
        @user = User.find(params[:user_id])
        @dataset = @user.datasets.build
    end

    def create
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.create(dataset_params)
        @user.update_attribute(:dataset_n, @user.datasets.count)
        if @dataset.save
            user_dir = File.join($stor_dir, id.to_s)
            ds_dir = File.join(user_dir, @dataset.name)
            Dir.mkdir(ds_dir)
            redirect_to user_dataset_path(:id => @dataset.id)
        else
            render 'new'
        end
    end

    def upload_file
        up_file = params[:file]
        id = cookies.encrypted[:user]
        @user = User.find(id)
        @dataset = @user.datasets.find(params[:id])
        user_dir = File.join($stor_dir, id.to_s)
        ds_dir = File.join(user_dir, @dataset.name)
        File.open(File.join(ds_dir, up_file.original_filename), 'wb') do |file|
            file.write(up_file.read)
        end
        redirect_to user_dataset_path, notice: "File uploaded."

    end

    private

    def dataset_params
        params.require(:dataset).permit(:name)
    end
end
